import { IncomingMessage, ServerResponse } from "node:http";
import { installSkill, listAvailableSkills } from "../commands/skills-install.js";

export async function handleSkillsAPI(
  req: IncomingMessage,
  res: ServerResponse,
  urlPath: string,
): Promise<boolean> {
  // Routes: /api/skills/list, /api/skills/install/:skill
  if (!urlPath.startsWith("/api/skills/")) return false;

  res.setHeader("Content-Type", "application/json");

  try {
    if (urlPath === "/api/skills/list") {
      const skills = await listAvailableSkills();
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, skills }));
      return true;
    }

    if (urlPath.startsWith("/api/skills/install/")) {
      const skill = urlPath.slice("/api/skills/install/".length);
      if (!skill || skill.includes("/")) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Invalid skill name" }));
        return true;
      }

      const result = await installSkill({ skill, auto: true });
      res.statusCode = result.status === "failed" ? 500 : 200;
      res.end(JSON.stringify({ success: result.status !== "failed", ...result }));
      return true;
    }

    if (urlPath === "/api/skills/install-all") {
      const recommended = ["github", "ffmpeg", "whisper"];
      const results = [];
      for (const skill of recommended) {
        const result = await installSkill({ skill, auto: true });
        results.push(result);
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, results }));
      return true;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: message }));
  }

  return true;
}

export function getSkillsAPIMenu() {
  return `
    <h3>Skills Management</h3>
    <div id="skills-panel">
      <button onclick="loadSkills()">Refresh Skills</button>
      <button onclick="installAllSkills()">Install All Recommended</button>
      <div id="skills-list"></div>
    </div>
    <script>
      async function loadSkills() {
        const resp = await fetch('/api/skills/list');
        const data = await resp.json();
        const html = data.skills.map(s =>
          \`<div class="skill-item">
            <span>\${s.status === 'installed' ? '✅' : '❌'} \${s.name}</span>
            \${s.status === 'missing' ? \`<button onclick="installSkill('\${s.name}')">Install</button>\` : ''}
          </div>\`
        ).join('');
        document.getElementById('skills-list').innerHTML = html;
      }

      async function installSkill(skill) {
        const resp = await fetch(\`/api/skills/install/\${skill}\`, { method: 'POST' });
        const data = await resp.json();
        alert(data.message);
        loadSkills();
      }

      async function installAllSkills() {
        const resp = await fetch('/api/skills/install-all', { method: 'POST' });
        const data = await resp.json();
        alert('Installation complete!');
        loadSkills();
      }

      loadSkills();
    </script>
  `;
}
