package com.cartvix.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @GetMapping("/status")
    public ResponseEntity<?> healthStatus() {
        boolean dbOk = checkDatabase();
        boolean googleOk = googleClientId != null && !googleClientId.isEmpty();
        String overall = dbOk ? "UP" : "DEGRADED";
        return ResponseEntity.ok(Map.of(
                "status", overall,
                "backend", "UP",
                "database", dbOk ? "UP" : "DOWN",
                "googleOAuth", googleOk ? "CONFIGURED" : "NOT_CONFIGURED",
                "timestamp", LocalDateTime.now().toString(),
                "version", "1.0.0"));
    }

    @GetMapping(value = "", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> healthPage() {
        boolean dbOk = checkDatabase();
        boolean googleOk = googleClientId != null && !googleClientId.isEmpty();
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm:ss a"));

        String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>Cartvix — Backend Status</title>
                  <link href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@700;800&family=Cabinet+Grotesk:wght@300;400;500&display=swap" rel="stylesheet"/>
                  <style>
                    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                    html, body { min-height: 100vh; background: #0d0d0f; font-family: 'Cabinet Grotesk', sans-serif; color: #f0ede8; overflow-x: hidden; }
                    .orb { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.15; pointer-events: none; animation: floatOrb 14s ease-in-out infinite alternate; }
                    .orb-1 { width: 520px; height: 520px; background: radial-gradient(circle,#ff3621,#ff6b4a); top: -150px; left: -120px; }
                    .orb-2 { width: 440px; height: 440px; background: radial-gradient(circle,#ff8060,#ff3621); bottom: -100px; right: -100px; animation-direction: alternate-reverse; animation-duration: 10s; }
                    @keyframes floatOrb { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(40px,30px) scale(1.07)} }
                    .grid-bg { position: fixed; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(255,54,33,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(255,54,33,0.04) 1px,transparent 1px); background-size: 48px 48px; }
                    .page { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; padding: 3rem 1.5rem 4rem; display: flex; flex-direction: column; align-items: center; gap: 2rem; }
                    .logo-wrap { display: flex; align-items: center; gap: 0.85rem; animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                    .logo-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(255,54,33,0.15); border: 1px solid rgba(255,54,33,0.3); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 24px rgba(255,54,33,0.2); font-size: 1.6rem; }
                    .brand { font-family: 'Clash Display', sans-serif; font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg,#ff3621,#ff8060,#ffb69f); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.02em; }
                    .sub { font-size: 0.8rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; text-transform: uppercase; }
                    .overall-badge { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.4rem; border-radius: 100px; font-family: 'Clash Display', sans-serif; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.04em; animation: fadeUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both; }
                    .overall-badge.up   { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; }
                    .overall-badge.down { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
                    .pulse { width: 9px; height: 9px; border-radius: 50%; background: currentColor; animation: pulse 1.5s ease infinite; }
                    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
                    .cards { width: 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); gap: 1rem; animation: fadeUp 0.5s 0.15s cubic-bezier(0.16,1,0.3,1) both; }
                    .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 1.4rem 1.5rem; display: flex; flex-direction: column; gap: 0.9rem; transition: border-color 0.2s, transform 0.2s; position: relative; overflow: hidden; }
                    .card:hover { border-color: rgba(255,54,33,0.25); transform: translateY(-2px); }
                    .card::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,54,33,0.5), transparent); }
                    .card-header { display: flex; align-items: center; justify-content: space-between; }
                    .card-icon-label { display: flex; align-items: center; gap: 0.65rem; }
                    .card-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
                    .card-label { font-family: 'Clash Display', sans-serif; font-weight: 700; font-size: 0.95rem; color: #fff; }
                    .status-pill { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; border-radius: 100px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
                    .status-pill.up   { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); color: #4ade80; }
                    .status-pill.down { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #f87171; }
                    .status-pill.info { background: rgba(96,165,250,0.12); border: 1px solid rgba(96,165,250,0.25); color: #60a5fa; }
                    .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
                    .card-detail { font-size: 0.8rem; color: rgba(255,255,255,0.3); line-height: 1.5; }
                    .card-detail span { color: rgba(255,255,255,0.55); }
                    .timestamp { font-size: 0.75rem; color: rgba(255,255,255,0.22); animation: fadeUp 0.5s 0.3s cubic-bezier(0.16,1,0.3,1) both; }
                    .timestamp span { color: rgba(255,255,255,0.4); }
                    .links { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; animation: fadeUp 0.5s 0.35s cubic-bezier(0.16,1,0.3,1) both; }
                    .links a { font-size: 0.78rem; color: rgba(255,54,33,0.75); text-decoration: none; padding: 0.35rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,54,33,0.2); transition: all 0.2s; }
                    .links a:hover { background: rgba(255,54,33,0.1); color: #ff8060; border-color: rgba(255,54,33,0.4); }
                    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                    @media(max-width:480px) { .page { padding: 2rem 1rem 3rem; } .brand { font-size: 1.5rem; } }
                  </style>
                </head>
                <body>
                  <div class="orb orb-1"></div>
                  <div class="orb orb-2"></div>
                  <div class="grid-bg"></div>
                  <div class="page">

                    <div class="logo-wrap">
                      <div class="logo-icon">&#128722;</div>
                      <div>
                        <div class="brand">Cartvix</div>
                        <div class="sub">Backend Health Status</div>
                      </div>
                    </div>

                    <div class="overall-badge %OVERALL_CLASS%">
                      <span class="pulse"></span>
                      All Systems %OVERALL_TEXT%
                    </div>

                    <div class="cards">

                      <!-- Backend -->
                      <div class="card">
                        <div class="card-header">
                          <div class="card-icon-label">
                            <div class="card-icon" style="background:rgba(255,54,33,0.12);border:1px solid rgba(255,54,33,0.25)">&#9881;&#65039;</div>
                            <div class="card-label">Backend Server</div>
                          </div>
                          <div class="status-pill up"><span class="dot"></span> Running</div>
                        </div>
                        <div class="card-detail">
                          Framework: <span>Spring Boot 3.2.0</span><br/>
                          Runtime: <span>Java 17</span><br/>
                          Port: <span>8080</span><br/>
                          Base Path: <span>/api</span>
                        </div>
                      </div>

                      <!-- PostgreSQL -->
                      <div class="card">
                        <div class="card-header">
                          <div class="card-icon-label">
                            <div class="card-icon" style="background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.25)">&#128452;&#65039;</div>
                            <div class="card-label">PostgreSQL Database</div>
                          </div>
                          <div class="status-pill %DB_CLASS%"><span class="dot"></span> %DB_TEXT%</div>
                        </div>
                        <div class="card-detail">
                          Provider: <span>Neon.tech (Cloud)</span><br/>
                          Database: <span>neondb</span><br/>
                          Connection: <span>%DB_CONN%</span><br/>
                          Pool: <span>HikariCP</span>
                        </div>
                      </div>

                      <!-- Google OAuth -->
                      <div class="card">
                        <div class="card-header">
                          <div class="card-icon-label">
                            <div class="card-icon" style="background:rgba(234,67,53,0.12);border:1px solid rgba(234,67,53,0.25)">&#128273;</div>
                            <div class="card-label">Google OAuth2</div>
                          </div>
                          <div class="status-pill %GOOGLE_CLASS%"><span class="dot"></span> %GOOGLE_TEXT%</div>
                        </div>
                        <div class="card-detail">
                          Flow: <span>One-Tap / Popup (ID Token)</span><br/>
                          Endpoint: <span>/api/auth/google</span>
                        </div>
                      </div>

                    </div>

                    <div class="timestamp">Last checked: <span>%TIMESTAMP%</span></div>

                    <div class="links">
                      <a href="/api/health/status">&#128202; JSON Status</a>
                      <a href="https://cartvix.netlify.app" target="_blank">&#127760; Frontend</a>
                    </div>

                  </div>
                </body>
                </html>
                """;

        html = html
                .replace("%OVERALL_CLASS%", dbOk ? "up" : "down")
                .replace("%OVERALL_TEXT%", dbOk ? "Operational &#10003;" : "Degraded &#9888;")
                .replace("%DB_CLASS%", dbOk ? "up" : "down")
                .replace("%DB_TEXT%", dbOk ? "Connected" : "Down")
                .replace("%DB_CONN%", dbOk ? "Active" : "Failed — check datasource URL")
                .replace("%GOOGLE_CLASS%", googleOk ? "up" : "down")
                .replace("%GOOGLE_TEXT%", googleOk ? "Configured" : "Missing")
                .replace("%TIMESTAMP%", now);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }

    private boolean checkDatabase() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}