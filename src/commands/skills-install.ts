import { spawn } from "node:child_process";
import { platform } from "node:os";

export interface SkillInstallOptions {
  skill: string;
  auto?: boolean;
}

export interface SkillInstallResult {
  skill: string;
  status: "success" | "failed" | "already_installed";
  message: string;
  exitCode?: number;
}

const SKILL_DEPENDENCIES: Record<string, { cmd: string; installer: string; package: string }> = {
  github: {
    cmd: "gh",
    installer: "winget",
    package: "GitHub.cli",
  },
  whisper: {
    cmd: "whisper",
    installer: "pip",
    package: "openai-whisper",
  },
  ffmpeg: {
    cmd: "ffmpeg",
    installer: "winget",
    package: "ffmpeg",
  },
  mcporter: {
    cmd: "mcporter",
    installer: "npm",
    package: "@modelcontextprotocol/inspector",
  },
  himalaya: {
    cmd: "himalaya",
    installer: "pip",
    package: "himalaya",
  },
};

export async function installSkill(options: SkillInstallOptions): Promise<SkillInstallResult> {
  const { skill } = options;
  const dep = SKILL_DEPENDENCIES[skill];

  if (!dep) {
    return {
      skill,
      status: "failed",
      message: `Unknown skill: ${skill}. Available: ${Object.keys(SKILL_DEPENDENCIES).join(", ")}`,
    };
  }

  // Check if already installed
  const isInstalled = await checkCommand(dep.cmd);
  if (isInstalled) {
    return {
      skill,
      status: "already_installed",
      message: `${skill} (${dep.cmd}) is already installed`,
    };
  }

  // Install based on platform and installer type
  try {
    const result = await executeInstall(dep);
    return {
      skill,
      status: "success",
      message: `Successfully installed ${skill}`,
      exitCode: 0,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      skill,
      status: "failed",
      message: `Failed to install ${skill}: ${message}`,
      exitCode: 1,
    };
  }
}

async function checkCommand(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    const checkCmd = platform() === "win32" ? "where" : "which";
    const child = spawn(checkCmd, [cmd], {
      stdio: "ignore",
      shell: true,
    });
    child.on("exit", (code) => resolve(code === 0));
  });
}

async function executeInstall(dep: {
  cmd: string;
  installer: string;
  package: string;
}): Promise<void> {
  let command = "";
  let args: string[] = [];

  if (dep.installer === "winget") {
    command = "winget";
    args = [
      "install",
      dep.package,
      "--accept-source-agreements",
      "--accept-package-agreements",
    ];
  } else if (dep.installer === "brew") {
    command = "brew";
    args = ["install", dep.package];
  } else if (dep.installer === "pip") {
    command = "pip";
    args = ["install", dep.package];
  } else if (dep.installer === "npm") {
    command = "npm";
    args = ["install", "-g", dep.package];
  }

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Installation failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

export async function listAvailableSkills(): Promise<
  Array<{ name: string; cmd: string; installer: string; status: string }>
> {
  const skills = [];
  for (const [name, dep] of Object.entries(SKILL_DEPENDENCIES)) {
    const isInstalled = await checkCommand(dep.cmd);
    skills.push({
      name,
      cmd: dep.cmd,
      installer: dep.installer,
      status: isInstalled ? "installed" : "missing",
    });
  }
  return skills;
}
