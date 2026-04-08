export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  content: string;
  quiz: QuizQuestion[];
  assignment: string;
}

export const courseData: Module[] = [
  {
    id: 1,
    title: "Introduction to Rate Limiting & Web Infrastructure",
    description: "Deep dive into identification mechanisms and distributed limiting algorithms.",
    content: `
# Module 1: Introduction to Rate Limiting

Rate limiting is the first line of defense for any web infrastructure. It is not just about blocking traffic; it's about resource allocation and system stability.

## Advanced Identification Mechanisms
Servers use a multi-layered approach to identify request sources:
- **IP Reputation & [ASN](glossary://Autonomous System Number, a unique identifier for a network on the internet.)**: Servers check if an IP belongs to a known data center (e.g., AWS, GCP) or a residential ISP. IPs from "dirty" ASNs are often pre-emptively limited.
- **TLS Fingerprinting ([JA3](glossary://A method for fingerprinting the TLS handshake of a client.))**: Before an HTTP request is even sent, the TLS handshake reveals the client's identity. 
- **HTTP/2 Fingerprinting**: The way a client manages streams and window sizes in HTTP/2 is highly characteristic.
- **Device Fingerprinting**: Combining screen resolution, fonts, and hardware specs into a unique hash.

## Distributed Rate Limiting Algorithms
1. **Token Bucket**: 
   - *Concept*: A bucket holds tokens. Each request consumes one. Tokens are added at a fixed rate.
   - *Benefit*: Allows for "burstiness" while maintaining a long-term average.
   - *Implementation*: Often uses Redis \`SET\` with expiration or Lua scripts for atomicity.
   - [Deep Dive: Token Bucket vs. Leaky Bucket](deepdive://The Token Bucket allows for bursts of traffic up to the bucket size, making it ideal for APIs where users might occasionally send many requests at once. The Leaky Bucket, however, enforces a strict, constant output rate, which is better for protecting downstream services from any spikes whatsoever.)
2. **Leaky Bucket**:
   - *Concept*: Requests enter a bucket and "leak" out at a constant rate.
   - *Benefit*: Smooths out traffic perfectly, but can drop requests if the bucket overflows.
3. **Sliding Window Log**:
   - *Concept*: Stores a timestamp for every request. To check the limit, count timestamps in the last $T$ seconds.
   - *Drawback*: High memory usage for high-volume APIs.
4. **Sliding Window Counter**:
   - *Concept*: A hybrid between Fixed Window and Sliding Log. It calculates a weighted average of the current and previous window's counts.

## The Role of Redis
In distributed systems, rate limiting must be global. Redis is the industry standard because:
- **Atomicity**: Using Lua scripts to ensure \`GET\` and \`SET\` operations happen as one unit.
- **Speed**: Sub-millisecond latency.
- **Data Structures**: Using Sorted Sets (\`ZSET\`) for sliding window implementations.
    `,
    quiz: [
      {
        question: "Which algorithm is best for ensuring a perfectly smooth, constant flow of requests to a downstream service?",
        options: ["Token Bucket", "Leaky Bucket", "Fixed Window", "Sliding Window Log"],
        correctAnswer: 1
      },
      {
        question: "Why is a Lua script preferred over multiple Redis commands for rate limiting?",
        options: ["It is faster to write", "It ensures atomicity and prevents race conditions", "It uses less memory", "It bypasses the rate limit"],
        correctAnswer: 1
      },
      {
        question: "What does ASN stand for in the context of IP identification?",
        options: ["Advanced System Network", "Autonomous System Number", "Application Service Node", "Automated Security Network"],
        correctAnswer: 1
      }
    ],
    assignment: "Using Redis (or a mock implementation), write a Lua script that implements a 'Sliding Window Counter' rate limiter. The script should take a key, a limit, and a window size as arguments."
  },
  {
    id: 2,
    title: "The Mechanics of Automation",
    description: "Mastering high-performance automation with Playwright and Puppeteer.",
    content: `
# Module 2: The Mechanics of Automation

Modern automation requires more than just clicking buttons. It requires managing complex browser environments and evading detection at the protocol level.

## [CDP](glossary://Chrome DevTools Protocol, a low-level protocol used to instrument, inspect, debug and profile Chromium-based browsers.) vs. WebDriver
- **WebDriver (Selenium)**: An older protocol that acts as an external controller. It is slower and easily detected via \`navigator.webdriver\`.
- **CDP**: A low-level protocol used by Puppeteer and Playwright. It allows for deep inspection and manipulation of the browser's internal state.

## Playwright Stealth Configuration
To evade detection, you must patch the browser's environment.
\`\`\`javascript
const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

chromium.use(StealthPlugin());

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  // Your automation logic here
})();
\`\`\`

## Concurrency Management
Scaling automation requires efficient resource usage:
- **[Browser Contexts](glossary://Isolated sessions within a single browser instance that share the same underlying browser process but have separate cookies and local storage.)**: Instead of launching a new browser for every task, use 'Contexts'. They are isolated sessions (cookies/storage) within a single browser instance, significantly reducing RAM overhead.
- **Pools**: Implement a worker pool to manage a fixed number of browser instances, preventing system crashes under high load.

[Deep Dive: Scaling to 1000+ Concurrent Sessions](deepdive://To scale to thousands of sessions, you must move beyond a single machine. Distributed automation involves a 'Master' node that distributes tasks to 'Worker' nodes via a message queue (like RabbitMQ or Redis Pub/Sub). Each worker manages a pool of browser contexts. Resource monitoring is critical: browsers are memory-heavy, so workers must be auto-scaled based on RAM pressure.)

## Handling Asynchronous State
Websites are dynamic. Using static \`waitForTimeout\` is a red flag and inefficient. Use:
- **Predicate-based waiting**: \`page.waitForFunction(() => window.dataLoaded === true)\`.
- **Network-based waiting**: \`page.waitForResponse(response => response.url().includes('/api/data'))\`.
    `,
    quiz: [
      {
        question: "What is the primary advantage of using Browser Contexts over multiple Browser Instances?",
        options: ["They are more secure", "They use significantly less RAM and CPU", "They bypass CAPTCHAs", "They allow for different browser versions"],
        correctAnswer: 1
      },
      {
        question: "Which protocol allows for lower-level interaction with the browser's rendering engine?",
        options: ["HTTP", "WebDriver", "CDP", "FTP"],
        correctAnswer: 2
      },
      {
        question: "Why is 'waitForTimeout' considered a bad practice in stealth automation?",
        options: ["It is too fast", "It creates predictable patterns and is inefficient", "It crashes the browser", "It blocks proxies"],
        correctAnswer: 1
      }
    ],
    assignment: "Create a Playwright script that uses a custom 'Context' to log into a site, saves the cookies to a JSON file, and then uses those cookies in a *second* context to verify the session is maintained without re-logging."
  },
  {
    id: 3,
    title: "Fingerprinting & Detection",
    description: "Deep dive into TLS, HTTP/2, and Browser-level identification.",
    content: `
# Module 3: Fingerprinting & Detection

Detection has moved from the application layer to the transport layer.

## TLS Fingerprinting (JA3/JA3S)
When a client connects via HTTPS, it sends a \`Client Hello\` packet. This packet contains:
- TLS Version
- Accepted Ciphers
- Extensions
- Elliptic Curves and Formats

JA3 produces a hash of these fields. Since different libraries (Python Requests, Go HTTP, Chrome) use different defaults, the server can identify the *tool* even if the \`User-Agent\` is spoofed.
- **JA3**: Client-side fingerprint.
- **JA3S**: Server-side response fingerprint (can be used to detect if a client accepts unusual cipher suites).

## HTTP/2 Fingerprinting
HTTP/2 introduced binary framing and multiplexing. Servers analyze:
- **SETTINGS Frame**: Initial parameters like \`MAX_CONCURRENT_STREAMS\`.
- **WINDOW_UPDATE**: How the client manages flow control.
- **Priority Frames**: The order in which resources are requested.

## Browser-Level Fingerprinting
- **[Canvas Fingerprinting](glossary://A technique that uses the HTML5 canvas element to identify a user's browser based on GPU rendering.)**: The server asks the browser to draw a complex shape with specific colors and fonts. Due to differences in GPU drivers and OS font rendering, the resulting pixel data is unique.
- **[AudioContext](glossary://An API for processing and synthesizing audio in the browser, often used for fingerprinting by analyzing audio signal processing.)**: Analyzing how the browser processes audio signals.
- **[WebGL](glossary://A JavaScript API for rendering interactive 2D and 3D graphics, which can reveal specific graphics card models.)**: Querying the \`UNMASKED_RENDERER_WEBGL\` to get the exact graphics card model.

[Deep Dive: The Math of Entropy](deepdive://Fingerprinting is a game of entropy. Each data point (screen resolution, fonts, GPU model) adds 'bits of entropy'. If the combination of these points is unique enough, you can be identified among millions of users. Stealth tools work by 'Normalizing' your entropy—making your browser look like one of the most common configurations (e.g., a standard Windows 10 Chrome user) to blend into the crowd.)

## Evading Detection
- **Normalization**: Using tools like \`browser-fingerprint-injector\` to make your browser look like a standard, high-volume configuration.
- **Noise Injection**: Adding subtle, random variations to Canvas or Audio outputs to prevent consistent tracking.
    `,
    quiz: [
      {
        question: "What does a JA3 hash represent?",
        options: ["The browser's version", "A signature of the TLS handshake parameters", "The user's IP address", "The server's certificate"],
        correctAnswer: 1
      },
      {
        question: "Which HTTP/2 frame is often used to fingerprint a client's flow control logic?",
        options: ["DATA", "HEADERS", "WINDOW_UPDATE", "PUSH_PROMISE"],
        correctAnswer: 2
      },
      {
        question: "How does Canvas fingerprinting work?",
        options: ["By tracking mouse movements", "By analyzing pixel-level differences in rendered text/shapes", "By checking the browser's cache", "By measuring network latency"],
        correctAnswer: 1
      }
    ],
    assignment: "Research the 'Akamai-Fingerprint-Header'. Write a 300-word explanation of how it combines multiple layers of fingerprinting into a single encrypted value."
  },
  {
    id: 4,
    title: "Proxy Networks & IP Rotation",
    description: "Architecting stealthy request distribution systems.",
    content: `
# Module 4: Proxy Networks & IP Rotation

IP rotation is the core of high-volume automation. Without it, even the most stealthy browser will be rate-limited.

## Proxy Architecture
1. **Forward Proxies**: The client connects to the proxy, which then connects to the target.
2. **Reverse Proxies**: Used by servers to distribute load (e.g., Cloudflare).
3. **Backconnect Proxies**: A single gateway IP that automatically rotates your request through a pool of thousands of exit nodes.

## Deep Dive: Residential vs. Mobile
- **Residential**: IPs assigned to home users. They have high trust because blocking them might block a real customer.
- **Mobile (4G/5G)**: The most trusted IPs. Because mobile carriers use CGNAT (Carrier Grade NAT), thousands of users share a single IP. Blocking a mobile IP is almost impossible for a WAF without massive collateral damage.

## SOCKS5 vs. HTTP/S
- **HTTP/S Proxies**: Understand the HTTP protocol. They can modify headers and are easier to set up for web scraping.
- **SOCKS5**: Protocol-agnostic. They pass raw TCP/UDP traffic. Best for non-web automation or when you need to bypass protocol-level detection.

## Preventing IP Leaks
- **DNS Leaks**: Ensure your browser resolves DNS *through* the proxy, not locally.
- **WebRTC Leaks**: WebRTC can reveal your local IP even behind a proxy. It must be disabled or spoofed.
- **IPv6**: Many proxies only support IPv4. If the target supports IPv6, your browser might bypass the proxy and leak your real IPv6 address.
    `,
    quiz: [
      {
        question: "Why are Mobile (4G/5G) proxies considered the 'gold standard' for stealth?",
        options: ["They are the fastest", "They are the cheapest", "Thousands of real users share the same IP due to CGNAT", "They encrypt all traffic"],
        correctAnswer: 2
      },
      {
        question: "What is a 'Backconnect' proxy?",
        options: ["A proxy that connects back to your server", "A single endpoint that manages a pool of rotating exit IPs", "A proxy used for database connections", "A type of VPN"],
        correctAnswer: 1
      },
      {
        question: "Which protocol is protocol-agnostic and supports UDP?",
        options: ["HTTP", "HTTPS", "SOCKS5", "FTP"],
        correctAnswer: 2
      }
    ],
    assignment: "Configure a local SOCKS5 proxy using SSH (\`ssh -D\`). Write a script that uses this proxy to fetch your IP address from an external API and verifies that it is different from your local IP."
  },
  {
    id: 5,
    title: "Bypassing Behavioral Analysis",
    description: "Simulating the 'chaos' of human interaction.",
    content: `
# Module 5: Bypassing Behavioral Analysis

Modern security systems use Machine Learning to build "Normalcy Models". If your bot is too efficient, it is detected.

## Humanizing Mouse Movements
Humans do not move in straight lines. They use [Bezier curves](glossary://A parametric curve used in computer graphics and related fields to model smooth curves that can be scaled indefinitely.) with varying velocity.
- **Acceleration**: Starting slow, speeding up in the middle, and slowing down as they approach the target.
- **Overshoot**: Occasionally missing the target and correcting.
- **Micro-jitters**: Small, involuntary movements while "thinking".

[Deep Dive: The Ghost-Cursor Library](deepdive://Ghost-cursor is a popular library that generates human-like mouse paths. It doesn't just move the mouse; it simulates the 'hesitation' and 'momentum' of a real human hand. Integrating this into your Playwright scripts is essential for bypassing advanced behavioral engines like Akamai or DataDome.)

## Typing Rhythms
- **[Inter-keystroke Delay (IKD)](glossary://The time interval between two consecutive key presses, used to identify automated typing patterns.)**: The time between key presses.
- **Human Pattern**: Fast for common sequences (e.g., 'the'), slow for others.
- **Mistakes**: Occasionally hitting the wrong key and using backspace.

## Session Warming & Cookie Aging
A "fresh" session with no history is suspicious.
- **Warming**: Browsing non-sensitive pages (Home, About, News) before hitting the target API.
- **Cookie Aging**: Letting a session sit for hours or days to build "trust" in the WAF's database.

## Evading Behavioral Biometrics
Some sites track:
- **[Scroll Depth](glossary://A metric that measures how far down a webpage a user has scrolled, often used to distinguish between bots and humans.)**: How far you scroll and at what speed.
- **Idle Time**: How long you stay on a page without moving.
- **Device Orientation**: (On mobile) The angle at which the phone is held.
    `,
    quiz: [
      {
        question: "What is 'Session Warming'?",
        options: ["Keeping the server warm", "Browsing non-sensitive pages to build session trust", "Increasing the CPU temperature", "Deleting all cookies"],
        correctAnswer: 1
      },
      {
        question: "Which type of curve is commonly used to simulate human-like mouse paths?",
        options: ["Linear", "Square", "Bezier", "Sine"],
        correctAnswer: 2
      },
      {
        question: "What does 'IKD' stand for in behavioral analysis?",
        options: ["Internal Key Data", "Inter-keystroke Delay", "Integrated Kernel Driver", "Instant Key Detection"],
        correctAnswer: 1
      }
    ],
    assignment: "Implement a 'HumanTyping' function that takes a string and an input element. It should type the string with random delays and a 5% chance of making a mistake (typing a nearby key and then backspacing)."
  },
  {
    id: 6,
    title: "CAPTCHA & Challenge Solvers",
    description: "The evolution of the Turing test and how to beat it.",
    content: `
# Module 6: CAPTCHA & Challenge Solvers

CAPTCHAs have evolved from simple text recognition to complex behavioral and hardware-based challenges.

## reCAPTCHA v3: The Silent Killer
Unlike v2, v3 has no UI. It returns a score between 0.0 (bot) and 1.0 (human).
- **Factors**: Your history on Google services, your IP reputation, and your behavior on the current site.
- **Action Parameter**: Developers can specify an 'action' (e.g., 'login', 'search'). Your score is evaluated specifically for that action.

## Cloudflare Turnstile
A modern, privacy-focused alternative. It uses:
- **[Proof of Work (PoW)](glossary://A form of cryptographic zero-knowledge proof in which one party proves to others that a certain amount of a specific computational effort has been expended.)**: The browser must solve a difficult math problem to prove it's a real client.
- **Browser API Validation**: Checking for the presence of specific, hard-to-spoof browser features.

[Deep Dive: Solving CAPTCHAs vs. Bypassing Them](deepdive://Solving a CAPTCHA involves using a service (like 2Captcha or Anti-Captcha) where real humans solve the challenge for you. Bypassing involves preventing the CAPTCHA from appearing in the first place by maintaining a high trust score through perfect fingerprinting and behavioral simulation. Bypassing is always preferred as it is faster and more reliable.)

## Advanced Solving Techniques
1. **Token Harvesting**: Running a separate "harvester" bot on a high-reputation IP/browser to solve CAPTCHAs and store the tokens in a database for your "worker" bots to use.
2. **AI-Driven Image Recognition**: Using YOLO (You Only Look Once) or similar models to identify objects in hCaptcha or reCAPTCHA v2.
3. **Audio Bypass**: Many CAPTCHAs offer an audio version for accessibility. These are often easier to solve using Speech-to-Text APIs.

## The 'Human-in-the-loop' API
Services like 2Captcha provide an API where you send the CAPTCHA payload, and they return the solution token.
- **Pros**: 100% success rate.
- **Cons**: Cost and latency (15-45 seconds).
    `,
    quiz: [
      {
        question: "What is the main difference between reCAPTCHA v2 and v3?",
        options: ["v3 is harder to solve", "v3 is invisible and returns a score", "v2 uses audio only", "v3 requires a Google account"],
        correctAnswer: 1
      },
      {
        question: "What is 'Token Harvesting'?",
        options: ["Collecting API keys", "Pre-solving CAPTCHAs and storing tokens for later use", "Stealing session cookies", "Mining cryptocurrency"],
        correctAnswer: 1
      },
      {
        question: "Which technique is often used to solve accessibility-focused CAPTCHA challenges?",
        options: ["OCR", "Speech-to-Text", "Bezier curves", "IP rotation"],
        correctAnswer: 1
      }
    ],
    assignment: "Research the 'hCaptcha Enterprise' challenge. How does it use 'Passive Detection' to identify bots without showing a puzzle?"
  },
  {
    id: 7,
    title: "Advanced Stealth Techniques",
    description: "Spoofing the unspooofable: Deep browser internals.",
    content: `
# Module 7: Advanced Stealth Techniques

To achieve true invisibility, you must match the "expected" state of a real user's machine perfectly.

## Header Ordering & Case Sensitivity
- **Chrome**: Sends headers in a specific order (e.g., \`Host\`, \`Connection\`, \`sec-ch-ua\`, \`User-Agent\`).
- **Firefox**: Uses a different order and different casing (e.g., \`User-Agent\` vs \`user-agent\`).
If your headers are out of order, it's an instant detection for advanced WAFs.

## Spoofing Hardware APIs
- **[Battery Status API](glossary://A web API that provides information about the system's battery charge level.)**: Real mobile devices have fluctuating battery levels. A bot with a constant 100% battery is suspicious.
- **Screen Orientation**: Matching the orientation (portrait/landscape) with the reported device type.
- **[Hardware Concurrency](glossary://The number of logical processors available to the browser, often used to fingerprint the user's hardware.)**: Reporting a realistic number of CPU cores (e.g., 4, 8, 16).

[Deep Dive: The 'navigator.webdriver' Flag](deepdive://By default, automated browsers set 'navigator.webdriver' to true. This is the easiest way for a site to detect a bot. Stealth patches override this property to 'undefined' or 'false'. However, advanced WAFs check for side-effects of this override, such as the presence of specific CDP properties in the global scope.)

## WebRTC Leak Prevention
WebRTC's \`RTCPeerConnection\` can reveal your local and public IP addresses, bypassing your proxy.
- **Solution**: Use a browser extension or a Playwright script to disable WebRTC or force it to use a specific proxy interface.

## Font Enumeration & Normalization
Servers can list all installed fonts. If you have "unusual" fonts (like those installed by Linux or specific dev tools), you are easily tracked.
- **Normalization**: Only reporting a standard set of "Web Safe" fonts.
    `,
    quiz: [
      {
        question: "Why is header ordering important for stealth?",
        options: ["It reduces latency", "It matches the predictable behavior of specific browsers", "It encrypts the payload", "It bypasses the proxy"],
        correctAnswer: 1
      },
      {
        question: "Which API can leak your real IP address even when using a proxy?",
        options: ["Battery Status API", "WebRTC", "Geolocation API", "Canvas API"],
        correctAnswer: 1
      },
      {
        question: "What is 'Font Enumeration' used for in fingerprinting?",
        options: ["To check if the text is readable", "To create a unique ID based on installed system fonts", "To speed up rendering", "To block ad-blockers"],
        correctAnswer: 1
      }
    ],
    assignment: "Write a JavaScript snippet that overrides the \`navigator.hardwareConcurrency\` property to return a random even number between 4 and 12, ensuring it is consistent for the entire session."
  },
  {
    id: 8,
    title: "API Security & Rate Limit Evasion",
    description: "Exploiting logic flaws and protocol-level vulnerabilities.",
    content: `
# Module 8: API Security & Rate Limit Evasion

Rate limiting is often implemented as a middleware. If you can bypass the middleware, you bypass the limit.

## Race Conditions (TOCTOU)
[TOCTOU](glossary://Time-of-Check to Time-of-Use, a class of software bugs caused by a race condition involving the checking of a state and the use of the results of that check.): Time-of-Check to Time-of-Use.
- **Scenario**: An API allows 10 requests per minute. If you send 50 requests in the *same millisecond*, the server might check the count for all 50 before any of them have finished updating the database.
- **Exploitation**: Using HTTP/2 multiplexing to send multiple requests in a single TCP packet.

## HTTP Parameter Pollution (HPP)
Sending multiple parameters with the same name.
- **Example**: \`GET /api/data?id=123&id=456\`.
- **Logic Flaw**: The rate limiter might only check the first \`id\`, while the application logic uses the second one.

[Deep Dive: Bypassing WAFs with Unicode](deepdive://Some WAFs normalize Unicode characters differently than the backend server. For example, a WAF might see 'admin' as safe, but the backend might normalize 'adm\u0131n' (with a dotless 'i') to 'admin', allowing you to bypass filters that block the literal string 'admin'.)

## Bypassing Cache-Based Limits
Some WAFs cache rate limit responses. By adding random query parameters (e.g., \`?cache_bust=123\`), you can force the WAF to re-evaluate the request, potentially hitting a different, non-limited edge node.

## GraphQL Complexity Attacks
GraphQL allows clients to request exactly what they need. A malicious client can request deeply nested data:
\`\`\`graphql
query {
  user {
    friends {
      friends {
        friends { ... }
      }
    }
  }
}
\`\`\`
This can crash the server or bypass simple "request count" limits. Defense requires "Query Cost Analysis".
    `,
    quiz: [
      {
        question: "What is a 'Race Condition' in API security?",
        options: ["A fast network", "When multiple requests are processed before a shared state can be updated", "A competition between developers", "A type of encryption"],
        correctAnswer: 1
      },
      {
        question: "How does GraphQL complexity-based rate limiting differ from traditional limiting?",
        options: ["It is faster", "It limits based on the 'cost' of the query rather than the number of requests", "It only works for users", "It blocks all queries"],
        correctAnswer: 1
      },
      {
        question: "What is 'HTTP Parameter Pollution'?",
        options: ["Sending too many headers", "Sending multiple parameters with the same name to confuse the parser", "Uploading large files", "Using invalid characters in a URL"],
        correctAnswer: 1
      }
    ],
    assignment: "Explain how HTTP/2 multiplexing can be used to increase the success rate of a race condition attack. Compare this to traditional HTTP/1.1 pipelining."
  },
  {
    id: 9,
    title: "Defense Strategies & WAFs",
    description: "Understanding the 'Enemy': How WAFs think and act.",
    content: `
# Module 9: Defense Strategies & WAFs

To defeat a WAF, you must understand its decision-making process.

## The Detection Pipeline
1. **Static Analysis**: Checking IPs against blacklists (SBL/XBL), checking for known bot User-Agents.
2. **[Protocol Analysis](glossary://The process of inspecting the structure and content of network protocols to identify anomalies or malicious patterns.)**: Validating TLS/HTTP/2 fingerprints.
3. **Behavioral Analysis**: Building a "Normalcy Profile" for each session.
4. **Challenge-Response**: Issuing JS challenges or CAPTCHAs if suspicion is high.

[Deep Dive: The 'False Positive' Problem](deepdive://WAFs must balance security with user experience. If a WAF is too strict, it will block real customers (False Positives). If it's too lenient, it allows bots (False Negatives). Attackers exploit this by 'Blending'—making their bot traffic look as much like a real, slightly-impatient customer as possible, forcing the WAF to choose between blocking a potential customer or allowing the bot.)

## Major WAF Behaviors
- **Cloudflare**: Uses "Turnstile" and "Under Attack Mode". It heavily relies on its massive global network to identify patterns across millions of sites.
- **Akamai Bot Manager**: Uses "Behavioral Biometrics" (mouse/keyboard/touch) and "Device Intelligence" to distinguish humans from bots.
- **DataDome**: A specialized bot protection that integrates at the edge. It is known for its extremely fast response times and deep protocol inspection.

## Honeytokens & Traps
Servers often inject "invisible" links or form fields.
- **[Honeytokens](glossary://A piece of data that is not used for legitimate purposes but is monitored for unauthorized access.)**: If a bot clicks a link with \`display: none\`, it is instantly flagged.
- **Traps**: Form fields that are hidden from humans but visible to bots (e.g., \`name="email_confirm"\`). If filled, it's a bot.
    `,
    quiz: [
      {
        question: "What is the primary trade-off for a WAF developer?",
        options: ["Speed vs Security", "Security vs False Positives (UX)", "Cost vs Performance", "Encryption vs Compression"],
        correctAnswer: 1
      },
      {
        question: "Which WAF is known for its deep integration of behavioral biometrics?",
        options: ["Cloudflare", "Akamai Bot Manager", "AWS WAF", "Nginx"],
        correctAnswer: 1
      },
      {
        question: "What is 'Global Threat Intelligence'?",
        options: ["A database of all users", "Sharing bot detection data across a network of protected sites", "A type of AI", "A government security agency"],
        correctAnswer: 1
      }
    ],
    assignment: "Select a website protected by Cloudflare. Use your browser's DevTools to identify the 'cf-clearance' cookie. Explain its purpose and how it relates to the 'Challenge Platform'."
  },
  {
    id: 10,
    title: "Ethics, Legality, and Responsible Disclosure",
    description: "Navigating the grey areas of the web.",
    content: `
# Module 10: Ethics, Legality, and Responsible Disclosure

Automation is a powerful tool. In the wrong hands, it can cause significant harm.

## The Legal Landscape
- **CFAA (Computer Fraud and Abuse Act)**: The primary US anti-hacking law. Historically used to prosecute scrapers, but recent rulings (HiQ vs LinkedIn) have clarified that scraping *publicly available* data is generally not a violation of the CFAA.
- **[GDPR](glossary://General Data Protection Regulation, a regulation in EU law on data protection and privacy in the European Union and the European Economic Area.) / CCPA**: If you scrape personal data (names, emails, addresses), you are a "Data Controller" and must comply with strict privacy laws.
- **ToS (Terms of Service)**: Breaking ToS is a civil matter, not a criminal one. However, it can lead to your account being banned or a lawsuit for "Breach of Contract".

[Deep Dive: hiQ vs. LinkedIn](deepdive://A landmark legal case in the US. The court ruled that scraping publicly available data (data that doesn't require a login) is generally not a violation of the CFAA. This provided a significant legal shield for the web scraping industry, though private data remains strictly protected.)

## Ethical Automation Principles
1. **Respect robots.txt**: While not legally binding, it is the standard for ethical crawling.
2. **Rate Limit Yourself**: Do not overwhelm the target server. A DoS attack is illegal and unethical.
3. **Identify Yourself**: If possible, use a User-Agent that includes a link to your contact info or project description.

## The Future: AI vs. AI
The future of rate limiting and automation is an arms race of Generative AI.
- **AI-Driven Defense**: WAFs using LLMs to detect subtle anomalies in request patterns.
- **AI-Driven Stealth**: Bots using LLMs to generate perfectly human-like interactions and content.
    `,
    quiz: [
      {
        question: "What was the significance of the HiQ vs LinkedIn court case?",
        options: ["It made all scraping illegal", "It clarified that scraping publicly available data is generally not a CFAA violation", "It banned residential proxies", "It created the GDPR"],
        correctAnswer: 1
      },
      {
        question: "What is the '90-day rule' in responsible disclosure?",
        options: ["You must fix a bug in 90 days", "You should wait 90 days after reporting a bug before disclosing it publicly", "You can only scrape for 90 days", "A session lasts 90 days"],
        correctAnswer: 1
      },
      {
        question: "Which file is used by websites to provide instructions to security researchers?",
        options: ["robots.txt", "security.txt", "index.html", "config.json"],
        correctAnswer: 1
      }
    ],
    assignment: "Draft a 500-word 'Ethical Automation Policy' for a hypothetical data science company. Include sections on data privacy, server load, and legal compliance."
  }
];

export const finalExam: QuizQuestion[] = [
  {
    question: "Which combination of techniques provides the highest level of stealth for a high-volume automation task?",
    options: [
      "Data center proxies + cURL + Fixed Window",
      "Residential proxies + Playwright + Humanized behavior + JA3 spoofing",
      "Public proxies + Axios + Random delays",
      "Mobile proxies + Selenium + Straight-line mouse movements"
    ],
    correctAnswer: 1
  },
  {
    question: "What is the most effective way to prevent a race condition in an API rate limiter?",
    options: [
      "Using a faster database",
      "Implementing atomic increments (e.g., Redis INCR with Lua)",
      "Increasing the rate limit",
      "Blocking all proxies"
    ],
    correctAnswer: 1
  },
  {
    question: "A WAF issues a JS challenge that requires the browser to solve a mathematical puzzle. Which tool can handle this?",
    options: ["Axios", "Python Requests", "Puppeteer/Playwright", "cURL"],
    correctAnswer: 2
  },
  {
    question: "In the context of fingerprinting, what does 'Canvas Noise' achieve?",
    options: [
      "It makes the browser run faster",
      "It prevents the server from grouping your bot with others using the same framework by adding entropy",
      "It bypasses IP blocks",
      "It encrypts the session"
    ],
    correctAnswer: 1
  },
  {
    question: "If a site uses Cloudflare Turnstile, what is the best approach for automation?",
    options: [
      "Use an OCR solver",
      "Use a headless browser and let it solve the challenge naturally (if stealthy enough)",
      "Switch to data center proxies",
      "Disable JavaScript"
    ],
    correctAnswer: 1
  },
  {
    question: "What is the primary risk of using a 'Fresh' session for a sensitive action?",
    options: [
      "It is too slow",
      "It lacks 'Cookie Age' and behavioral history, making it highly suspicious to WAFs",
      "It uses too much RAM",
      "It bypasses the proxy"
    ],
    correctAnswer: 1
  },
  {
    question: "How does HTTP/2 multiplexing contribute to race condition attacks?",
    options: [
      "It encrypts the traffic",
      "It allows sending multiple requests in a single TCP packet, reducing the time gap between them",
      "It rotates the IP address",
      "It blocks the rate limiter"
    ],
    correctAnswer: 1
  }
];
