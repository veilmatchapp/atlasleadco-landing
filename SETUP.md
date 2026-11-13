# Claude Code setup for the Atlas site

All of this is free. Commands were checked against each project's official README or docs on Nov 12, 2026.
Open a terminal in `H:\Claude\Projects\atlasleadco-landing`, start `claude`, then run these one at a time.

## 1. Skill: frontend-design (Anthropic)
Inside Claude Code:
```
/plugin install frontend-design@claude-plugins-official
```
If that marketplace isn't found:
```
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-code-plugins
```
Then run `/reload-plugins`, and `/plugin` to confirm it's listed.

## 2. Chrome DevTools MCP (Google, Apache-2.0): performance traces, console, network
Inside Claude Code:
```
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
/plugin install chrome-devtools-mcp@chrome-devtools-plugins
```

## 3. Playwright MCP (Microsoft, Apache-2.0): a real browser, screenshots at phone and desktop sizes
In the terminal (not inside Claude Code):
```
claude mcp add playwright npx @playwright/mcp@latest
```

## 4. Context7 (Upstash, MIT): current library docs
In the terminal:
```
claude mcp add context7 -- npx -y @upstash/context7-mcp
```
Optional: a free key from context7.com raises rate limits. Add `--api-key YOUR_KEY` to the command.

## 5. GitHub MCP (official): optional, since git already works in your terminal
Create a fine-grained token limited to veilmatchapp/atlasleadco-landing, then run:
```
claude mcp add --transport http github https://api.githubcopilot.com/mcp -H "Authorization: Bearer YOUR_TOKEN"
```
Never paste the token into a file in the repo.

## 6. Check it all
```
claude mcp list
```
You should see playwright, context7 (and github), each marked connected. Inside Claude Code, `/plugin` should list frontend-design and chrome-devtools-mcp.

## 7. Start the build
Inside Claude Code, in this folder:
```
Read CLAUDE.md. Then start step 1 of its Process section.
```

## Skipped on purpose
- Figma MCP: real use needs a paid Dev or Full seat.
- Spline: the free plan watermarks exports, and paid starts at $12/seat/month billed annually.
