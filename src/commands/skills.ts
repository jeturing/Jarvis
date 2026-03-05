import { Command } from "commander";
import { installSkill, listAvailableSkills } from "./skills-install.js";

export function skillsCommand(): Command {
  const cmd = new Command("skills");
  cmd.description("Manage Moltbot skills and dependencies");

  cmd
    .command("list")
    .description("List available skills and their installation status")
    .action(async () => {
      const skills = await listAvailableSkills();
      console.log("\n📦 Available Skills & Dependencies");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      for (const skill of skills) {
        const icon = skill.status === "installed" ? "✅" : "❌";
        console.log(`${icon} ${skill.name.padEnd(15)} (${skill.cmd}) [${skill.installer}]`);
      }
      console.log();
    });

  cmd
    .command("install <skill>")
    .description("Install a skill dependency (e.g., github, whisper, ffmpeg)")
    .action(async (skill) => {
      console.log(`\n📥 Installing ${skill}...\n`);
      const result = await installSkill({ skill, auto: true });
      console.log(`${result.status === "success" ? "✅" : "❌"} ${result.message}`);
      if (result.status === "failed") {
        process.exit(result.exitCode || 1);
      }
    });

  cmd
    .command("install-all")
    .description("Install all recommended skills")
    .action(async () => {
      const recommended = ["github", "ffmpeg", "whisper"];
      console.log(`\n📥 Installing recommended skills...\n`);
      for (const skill of recommended) {
        const result = await installSkill({ skill, auto: true });
        console.log(`${result.status === "success" ? "✅" : "❌"} ${result.message}`);
      }
    });

  return cmd;
}
