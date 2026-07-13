import type { PromptItem } from "@/lib/ai-prompts/types";

export const PROMPTS: PromptItem[] = [
  // ── Image Effects ──────────────────────────────────────────────────────────
  {
    id: 1,
    category: "Image Effects",
    title: "MS PAINT EFFECT",
    driveImageId: "1nUieZIQxt_N2Ji4e5tqhTkQkcZ0tZ9bC",
    imageAlt: "MS Paint style redraw result",
    prompt:
      "Redraw the attached image in the most clumsy, scribbly, and utterly pathetic way possible. Use a white background, and make it look like it was drawn in an old computer painting program with a mouse. It should be vaguely similar but also not really, kind of matching but also off in a confusing, awkward way, with that low-quality pixel-by-pixel feel that really emphasizes how ridiculously bad it is. Actually, you know what, whatever, just draw it however you want. MS paint type",
  },
  {
    id: 2,
    category: "Image Effects",
    title: "SKIN ENHANCER",
    driveImageId: "1Ty7GIjLDqCkOeTtPoOQvA0LyndGsKrw9",
    imageAlt: "Skin enhancer before and after result",
    prompt:
      "Skin enhancement retouch, preserve original identity and structure, refine skin texture without smoothing, maintain pores, freckles, and natural variation, reduce temporary blemishes and redness only, even out tone subtly without flattening depth, retain natural highlights and shadow transitions, keep under-eye detail intact with slight softening not removal, avoid plastic or airbrushed finish, maintain original lighting and color balance, enhance micro-contrast for realistic texture, lips and eyes untouched except for natural clarity, no reshaping of facial features, no artificial glow, no over-sharpening, seamless integration with original image, invisible edit with high realism.",
  },
  {
    id: 3,
    category: "Image Effects",
    title: "MINECRAFT EFFECT",
    driveImageId: "1aMc0dGbW0IEKnh1QZDRaGrqtYgz6qIzP",
    imageAlt: "Minecraft effect before and after result",
    prompt:
      "Keep the human subject 100 percent photorealistic and untouched. No pixel filter, no stylization, no lighting remap on skin. Preserve exact facial detail, pores, fabric weave, hair strands, natural shadows. Expression and posture remain identical. Rebuild the background as a structurally accurate Minecraft voxel replica of the original location. Do not reinterpret. Match the exact layout, spacing, depth, and geometry from the reference image. If there is a path, replicate its exact curve and width using gravel or dirt blocks. If there are trees, match trunk positions, height ratios, canopy spread using appropriate log and leaf blocks. If there are buildings, recreate their silhouette, window placement, roof angle using Minecraft block geometry. If there are rocks, benches, fences, signs, convert them into block equivalents but maintain their exact position and proportion relative to the subject. Perspective must match the original photo perfectly. Horizon line, camera height, focal distance, framing, subject scale all identical. Any object physically touching the subject must convert into Minecraft logic.",
  },
  {
    id: 4,
    category: "Image Effects",
    title: "GROUP SELFIE",
    driveImageId: "1Gs76NyIIeHjiNkbjIypGJ60yxTybPKkS",
    imageAlt: "Group selfie AI generated result",
    prompt:
      "Raw iPhone selfie, subjects from reference images standing close together, both leaning slightly into frame, casual shoulder-to-shoulder composition, direct gaze into camera with relaxed neutral expressions, handheld at arm's length with slight upward tilt, soft indoor lighting mixed with phone flash causing mild overexposure on highlights and shadow falloff, natural skin texture visible with pores and subtle makeup detail, stray hairs and fabric creases present, background loosely visible with everyday environment elements slightly out of focus, minor motion blur in edges, slight lens distortion from close proximity, off-center framing with imperfect crop, subtle ISO grain and uneven white balance, unpolished, candid realism.",
  },
  {
    id: 5,
    category: "Image Effects",
    title: "LEGO EFFECT",
    driveImageId: "16DHkHW6q0XP9VnJXnH20Vnj1V8GFSLTF",
    imageAlt: "LEGO effect before and after result",
    prompt:
      "Keep the human subject 100 percent photorealistic and untouched. No pixel filter, no stylization, no lighting remap on skin. Preserve exact facial detail, pores, fabric weave, hair strands, natural shadows. Expression and posture remain identical. Rebuild the background as a structurally accurate LEGO replica of the original location. Do not reinterpret. Match the exact layout, spacing, depth, and geometry from the reference image. If there is a path, replicate its exact curve and width using LEGO tile and plate construction. If there are trees, match trunk positions, height ratios, canopy spread using appropriate LEGO trunk builds and layered foliage elements. If there are buildings, recreate their silhouette, window placement, roof angle using authentic LEGO architecture geometry and brick proportions. If there are rocks, benches, fences, signs, convert them into LEGO-built equivalents but maintain their exact position and proportion relative to the subject. Perspective must match the original photo perfectly. Horizon line, camera height, focal distance, framing, subject scale all identical. Any object physically touching the subject must convert into LEGO logic. Real animal becomes a LEGO animal or molded figure equivalent. Held object becomes a brick-built version scaled correctly to the hand. Objects not touching the subject remain LEGO-built but positioned exactly where they appear in the reference. Lighting recreated as realistic daylight interacting with LEGO plastic materials while matching the direction and intensity of the original photo. Preserve subtle specular highlights on LEGO surfaces, natural shadow falloff, soft environmental reflections, and realistic material response. If fog exists, rebuild it using layered atmospheric haze while preserving the same depth falloff. Maintain recognizable background identity. The location should be immediately identifiable from composition alone, just rendered in detailed LEGO construction. High-resolution cinematic realism. Realistic LEGO material texture with visible seams, studs, injection molding detail, slight surface scuffs, authentic plastic reflections. No UI, no text, no overlays.",
  },
  {
    id: 6,
    category: "Image Effects",
    title: "4K EFFECT",
    driveImageId: "1cCuK-aU0948nL7NQnkfoBZJPLi4Ug5jJ",
    imageAlt: "4K enhancement before and after result",
    prompt:
      "Ultra-high-resolution 4K enhancement based strictly on the provided reference image. Absolute fidelity to original facial anatomy, proportions, and identity. Preserve expression, gaze, pose, camera angle, framing, and perspective with zero deviation. Clothing, hair, skin, and background elements must remain unchanged in structure, placement, and design. Recover fine-grain detail with natural realism. Enhance pores, fine lines, hair strands, eyelashes, fabric weave, seams, and material edges without introducing stylization. Maintain original color science, white balance, and tonal relationships exactly as captured. Lighting direction, intensity, contrast, and shadow behavior must match the source image precisely, with only improved clarity and expanded dynamic range. No relighting, no reshaping. Remove any grain. Apply controlled sharpening and high-frequency detail reconstruction. Remove compression artifacts and noise while retaining authentic texture. No smoothing, no plastic skin, no artificial gloss. Facial features must remain consistent across the entire image with coherent anatomy and clean, stable edges. Negative constraints: no warping, no facial drift, no added or missing anatomy, no altered hands, no distortions, no perspective shift, no text or graphics, no hallucinated detail, no stylized rendering. Output must read as a true-to-life, photorealistic upscale that matches the reference exactly, only clearer, sharper, and higher resolution.",
  },

  {
    id: 27,
    category: "Image Effects",
    title: "CHANGE HAIRSTYLE",
    driveImageId: "1FY2wAAjgRcfnIw5vjqtNvhbFxLUB7_g8",
    imageAlt: "Change hairstyle before and after result",
    prompt:
      "Change the person's hairstyle in this photo to [DESIRED HAIRSTYLE, SUCH AS LONG WAVY HAIR, SHORT BOB, CURLY HAIR, STRAIGHT HAIR, PONYTAIL, BANGS, BUZZ CUT, LAYERED HAIR, SLICKED-BACK HAIR, OR SHOULDER-LENGTH HAIR]. Keep the person's face, identity, facial features, expression, pose, clothing, skin texture, lighting, shadows, camera angle, and background the same. Make the new hairstyle look natural, with realistic texture, volume, hairline, parting, flyaways, highlights, and shadows that match the original photo. Do not change the face, alter facial proportions, distort the head or ears, over-smooth the skin, or make the hair look fake. The final image should look like a seamless, photo-realistic image of the same person with the requested hairstyle.",
  },
  {
    id: 28,
    category: "Image Effects",
    title: "FASHION VISUALIZATION",
    driveImageId: "1sZeG6j-7n2oYs_73cIMCWdlx8mCWpVCF",
    imageAlt: "Fashion visualization before and after result",
    prompt:
      "Dress the person in the first image with the clothing from the second image. Keep the person's face, identity, expression, pose, body proportions, skin texture, hairstyle, lighting, shadows, camera angle, background, and overall photo style the same. Preserve the design, color, material, fit, and style of the clothing from the second image as accurately as possible. Make the clothing look naturally worn on the person's body, with realistic fabric draping, folds, seams, wrinkles, texture, colors, and shadows that match the pose and lighting of the first image. Do not change the face, reshape the body, alter the pose, distort hands or limbs, warp the background, or make the clothing look fake or pasted on. The final image should look like a seamless, photo-realistic image of the same person naturally wearing the clothing from the second image.",
  },
  {
    id: 29,
    category: "Image Effects",
    title: "CORRECT POSTURE",
    driveImageId: "1vMjYWKc_PJcoyNrkuqSzet0H8Vum4-Qi",
    imageAlt: "Correct posture before and after result",
    prompt:
      "Subtle correction of body posture. Shoulders back and down, chest slightly elevated, head naturally aligned over the shoulders. Aligned spine. Maintain natural, confident, and relaxed body language. Clothing: realistic fabric drape adjusted to the new posture. Preserve original face, identity, background, and lighting. Final result: identical photo with improved and natural posture.",
  },
  {
    id: 30,
    category: "Image Effects",
    title: "CHANGE EXPRESSION",
    driveImageId: "1AltbxPMw3Adl6fhGxYL5Mf54z1IM7PMm",
    imageAlt: "Change expression before and after result",
    prompt:
      "Change the facial expression of the person in this photo to [DESIRED EXPRESSION — E.G., SMILING, SURPRISED, LAUGHING, ETC.]. Keep the person's identity, facial features, and overall lighting intact while making the expression look natural and realistic. Ensure the adjustment blends seamlessly with the original image.",
  },
  {
    id: 31,
    category: "Image Effects",
    title: "CLOTHING COLOR CHANGE",
    driveImageId: "18TsqEY-GHOLJkozHkHxDbyy8uyYJEccZ",
    imageAlt: "Clothing color change before and after result",
    prompt:
      "Change the color of the outfit from [CURRENT] to [TARGET]. 100% preservation of non-clothing elements: face, skin, hair, accessories, and environment. Precise identification of fabric edges. Light interaction: maintain tonal range, highlights, shadows, and texture (denim, silk, cotton). Wrinkles and drape remain unchanged. No color bleeding onto the skin. Result: photorealistic and undetectable.",
  },
  {
    id: 32,
    category: "Image Effects",
    title: "ANIME EFFECT",
    driveImageId: "1NtsJaNHsS8lHLAcC3jUBcyPM1wbvcWuC",
    imageAlt: "Anime effect before and after result",
    prompt:
      "Anime style transformation, convert the reference image into detailed hand-drawn anime while preserving exact composition, same camera angle, framing, pose, and character proportions unchanged, maintain identical facial structure and expression translated into anime aesthetics, clean linework with controlled variation in line weight, large expressive eyes styled naturally to match original gaze direction, simplified but accurate nose and mouth, hair reinterpreted into defined anime strands while keeping original shape and flow, skin rendered with smooth tonal shading and soft gradients, lighting direction and intensity preserved from original image, colors slightly stylized but faithful to source palette, background converted into anime environment matching original depth and perspective, subtle cel shading with gentle highlights, no distortion of anatomy or perspective, no change in crop or zoom, high fidelity adaptation rather than reinterpretation.",
  },
  {
    id: 33,
    category: "Image Effects",
    title: "PRODUCT AD",
    driveImageId: "1jmDkUi7zVNqeZ5iqm54TySrrAQVIrQ5m",
    imageAlt: "Product ad transformation result",
    prompt:
      "Product studio transformation, isolate the product from the reference image and rebuild as a premium ad composition, hero product centered and sharply in focus, surrounded by its key ingredients arranged with intention and depth, ingredients fresh and tactile, sliced, crushed, or whole depending on context, composition balanced but not perfectly symmetrical, clean surface with subtle reflections, background designed to match the product's color palette and mood, soft gradients or tonal transitions, high-end studio lighting with controlled highlights and gentle shadow falloff, crisp edges with slight natural shadow grounding the product, micro-details visible like condensation, texture on ingredients, and line surface imperfections, minimal but intentional negative space, no clutter beyond ingredients, polished commercial finish without looking artificial, accurate color rendering and realistic material response.",
  },
  {
    id: 34,
    category: "Image Effects",
    title: "GTA EFFECT",
    driveImageId: "1_jMeVmBfG56DKir3Ivyj5K9JNNfwWT8U",
    imageAlt: "GTA V effect before and after result",
    prompt:
      "Rebuild the entire scene from the reference image as a real-time 3D render inside the GTA V Rage engine. Do not apply a filter. Fully reconstruct all people, vehicles, architecture, terrain, and props as polygonal 3D assets native to GTA V. The result should look like an authentic in-game screenshot captured on a high-end PC, ultra settings enabled. All subjects must be converted into clearly modeled geometry with visible polygon structure, baked normal maps, and game-accurate textures. Faces, bodies, and clothing should follow GTA V character proportions and anatomy, slightly exaggerated, rigid, and digitally sculpted. Skin is matte and textured, no photographic pores. Hair is clumped, card-based, slightly stiff. Clothing uses flat fabric shaders with visible seams and texture repetition. Environment must feel like Los Santos or Blaine County logic. Buildings are modular, edges slightly sharp, surfaces tiled and optimized. Roads, sidewalks, vegetation, street props, and background elements are simplified but dense, clearly game-built constructed. No real-world photographic depth or lens artifacts. Lighting follows GTA V real-time lighting behavior. Strong directional sunlight or overcast skylight depending on scene. Hard shadows with defined edges, subtle ambient occlusion in corners. Reflections are screen-space and imperfect. Colors are slightly saturated with the recognizable GTA V color grading. Contrast is controlled but punchy. Materials must read as video game assets. Asphalt is flat and grainy. Metal has simple specular highlights. Glass is clean with limited reflection depth. Vegetation is slightly stiff and stylized. Nothing should appear physically accurate or cinematic-render realistic. Camera should feel like a gameplay or Rockstar Editor capture. Third-person or free camera perspective. Slight wide-angle distortion. Stable framing. No depth of field blur. No motion blur unless minimal and engine-based. Overall look is unmistakably GTA V. Real-time 3D. Polygon. Textured. Optimized. Stylized realism. Clearly not a photograph.",
  },

  {
    id: 23,
    category: "Image Effects",
    title: "HAIRLINE RESTORATION",
    driveImageId: "1i7Si5AVpCWHJi3Uc2iwFtKjjxMNft7qI",
    imageAlt: "Hairline restoration before and after result",
    prompt:
      "Natural and subtle hair restoration from the base photo. Fill in temples and frontal hairline with identical color, texture, and density. Lower the hairline by 5-15mm to a natural M-shaped or rounded position. Preserve original hairstyle, facial features, and expression. Final image: exact photo, hair subtly denser and more youthful, undetectable editing.",
  },
  {
    id: 24,
    category: "Image Effects",
    title: "CHANGE POSE",
    driveImageId: "1k2K01jwLw5_DykofFoN5XabK7ntXMxCV",
    imageAlt: "Change pose before and after result",
    prompt:
      "Change the person's pose in this photo to [DESIRED POSE, SUCH AS SITTING CROSS-LEGGED, ARMS CROSSED, WALKING FORWARD, JUMPING MID-AIR, LEANING AGAINST A WALL, LOOKING OVER THE SHOULDER, HANDS IN POCKETS, OR HOLDING AN OBJECT]. Keep the person's face, identity, facial features, expression, body proportions, clothing, skin texture, hairstyle, lighting, shadows, camera angle, background, and overall photo style as consistent as possible. Make the new pose look natural, balanced, and anatomically realistic, with believable limb placement, body weight, posture, clothing folds, contact points, and shadows that match the original scene. Do not distort the face, warp the body, create extra fingers or limbs, change the person's identity, alter the background, or make the pose look stiff or artificial. The final image should look like a seamless, photo-realistic image of the same person naturally captured in the requested pose.",
  },
  {
    id: 25,
    category: "Image Effects",
    title: "REMOVE DARK CIRCLES",
    driveImageId: "1v5I3KYMBHYQZglYo_sMs28CQySQ6nvPl",
    imageAlt: "Remove dark circles before and after result",
    prompt:
      "Subtle reduction of dark circles and eye bags from the base photo. Lighten pigmentation, soften slight puffiness, and dim shadows. Naturally blend the tone of the dark circles with the cheeks. Maintain the natural eye crease, bone structure, and expression lines. Correct only darkness and inflammation. No general beauty filters. Result: bright, rested, and natural eyes.",
  },
  {
    id: 26,
    category: "Image Effects",
    title: "EDIT TEXT IN IMAGE",
    driveImageId: "1Un4ky_0XA12wvB1yId0hAJvJNY2kS98I",
    imageAlt: "Edit text in image before and after result",
    prompt:
      "Edit only the text in this image by replacing [EXISTING TEXT TO REPLACE] with [NEW TEXT]. Keep the original design, layout, font style, font size, letter spacing, color, alignment, perspective, shadows, texture, and placement consistent with the surrounding text and overall image. Make the new text blend naturally into the image as if it was part of the original design. Do not change any other text, objects, people, background elements, colors, lighting, or composition. Preserve the original image style and make the edit clean, realistic, and seamless.",
  },

  // ── Software Development ──────────────────────────────────────────────────
  {
    id: 13,
    category: "Software Development",
    title: "TURN CLAUDE INTO A FULL STARTUP ENGINEERING TEAM",
    prompt:
`Act like a senior full-stack engineer building a production-ready startup MVP from scratch. First design the complete system architecture, then build the most minimal but scalable version possible.

Include:
• System architecture
• File structure
• Database schema
• API endpoints
• UI architecture
• Production-ready code

Build it like a real startup that could scale to millions of users.`,
  },
  {
    id: 14,
    category: "Software Development",
    title: "TURN CLAUDE INTO A PRODUCTION-LEVEL DEBUGGING MONSTER",
    prompt:
`Act like a senior debugging engineer investigating a live production issue. Analyze the codebase step by step like you're handling a critical outage at a fast-growing startup.

Your job:
• Understand what the code actually does
• Trace the real root cause
• Explain why the failure happens
• Identify hidden edge cases
• Propose the most robust fix possible

Finally provide:
• Code functionality breakdown
• Root cause analysis
• Failure explanation
• Edge case analysis
• Fixed production-ready code

Do not guess. Think deeply before making changes.`,
  },
  {
    id: 15,
    category: "Software Development",
    title: "TURN CLAUDE INTO A PERFORMANCE OPTIMIZATION ENGINEER",
    prompt:
`Act like a senior performance engineer optimizing a production application used by millions of users.

Your goals:
• Maximum speed
• Lower memory usage
• Better scalability
• Faster rendering
• Cleaner execution

Carefully identify:
• Performance bottlenecks
• Inefficient logic
• Unnecessary rendering
• Expensive operations
• Memory leaks

Then provide:
• Performance issue breakdown
• Optimization strategies
• Improved production-ready code
• Scalability recommendations

Optimize the code like you're preparing it for massive traffic.`,
  },
  {
    id: 16,
    category: "Software Development",
    title: "MAKE CLAUDE REBUILD MESSY CODE INTO CLEAN SCALABLE ARCHITECTURE",
    prompt:
`Act like a senior software architect rebuilding a messy production codebase using clean architecture principles.

Your mission:
• Separate concerns properly
• Increase modularity
• Reduce tight coupling
• Improve scalability
• Make the codebase easier to maintain long term

Do NOT change the product behavior. Only improve the architecture and code quality.

Finally provide:
• New folder structure
• Clean architecture breakdown
• Refactored production-grade code
• Explanation of architectural improvements

Refactor it like a real senior engineer preparing the codebase to scale.`,
  },
  {
    id: 17,
    category: "Software Development",
    title: "MAKE CLAUDE ARCHITECT YOUR ENTIRE STARTUP BACKEND",
    prompt:
`Act like a senior systems architect designing infrastructure for a high-growth startup. First design a scalable production-grade system architecture. Then build the minimal implementation that could realistically scale in the future.

Include:
• System architecture
• Component structure
• Data flow
• API design
• Database schema
• Caching strategy
• Production-ready implementation code

Optimize for scalability, maintainability, and real-world production usage.`,
  },
  {
    id: 18,
    category: "Software Development",
    title: "TURN CLAUDE INTO AN ENTIRE AI ENGINEERING TEAM",
    prompt:
`You are now 4 elite AI agents working together on the same project:
• Architect
• Engineer
• Reviewer
• Optimizer

Each agent has a specific role:
• Architect → Design scalable system architecture
• Engineer → Build the implementation
• Reviewer → Perform senior-level code review
• Optimizer → Improve performance and scalability

Workflow:
Architect designs the system
Engineer builds it
Reviewer critiques and improves it
Optimizer makes it production-grade

Finally provide:
• Complete architecture
• Full implementation
• Review feedback
• Final optimized version

Think and collaborate like a world-class engineering team building a real startup product.`,
  },
  {
    id: 19,
    category: "Software Development",
    title: "TURN CLAUDE INTO A SENIOR FRONTEND ENGINEER",
    prompt:
`Act like a senior frontend engineer building production-grade UI systems for a modern startup.

Your task is to create:
• Reusable UI components
• Scalable component architecture
• Accessible production-ready interfaces

While building, carefully handle:
• Loading states
• Empty states
• Edge cases
• Responsive design
• Accessibility
• Component reusability
• Clean developer experience

Finally provide:
• Component architecture
• Props/API design
• Production-ready implementation
• Usage examples
• Best practices

Build it like it's going into a real production app used by millions.`,
  },
  {
    id: 20,
    category: "Software Development",
    title: "AI TECHNICAL LEAD MODE",
    prompt:
`Act like a senior technical lead managing a real engineering team.

Before writing code:
• Ask clarifying questions
• Challenge bad decisions
• Identify scaling risks
• Suggest better approaches
• Prioritize simplicity

Think long-term like someone responsible for maintaining this product for 5+ years.

Then provide:
• Technical decisions
• Tradeoff analysis
• Recommended architecture
• Implementation plan
• Production-ready solution

This makes Claude stop behaving like a code generator and start thinking like an actual tech lead.`,
  },
  {
    id: 21,
    category: "Software Development",
    title: "PRODUCTION SECURITY AUDIT",
    prompt:
`Act like a senior security engineer auditing a production application.

Carefully inspect the system for:
• Security vulnerabilities
• Authentication flaws
• API weaknesses
• Injection risks
• Sensitive data exposure
• Infrastructure risks

Then provide:
• Vulnerability report
• Severity levels
• Attack scenarios
• Secure implementation fixes
• Production-grade recommendations`,
  },
  {
    id: 22,
    category: "Software Development",
    title: "SENIOR DEVOPS + DEPLOYMENT ENGINEER",
    prompt:
`Act like a senior DevOps engineer preparing this application for real production deployment.

Your job:
• Design deployment architecture
• Configure CI/CD
• Setup monitoring/logging
• Improve reliability
• Reduce downtime risks
• Optimize scaling

Provide:
• Infrastructure architecture
• Deployment workflow
• CI/CD pipeline
• Docker/Kubernetes setup
• Monitoring strategy
• Production deployment checklist`,
  },

  // ── System Design ─────────────────────────────────────────────────────────
  {
    id: 35,
    category: "Software Development",
    title: "SYSTEM DESIGN CONCEPTS CRASH COURSE",
    prompt:
`Act like a senior software engineer teaching system design for interviews. Explain each of the following 21 core concepts with a simple definition, when you'd use it in a real system, and a concrete real-world example:

1. API — How services communicate
2. Load Balancer — Distributes traffic across servers
3. Caching — Stores frequently used data for speed
4. CDN — Serves content from nearby locations
5. Database Indexing — Makes queries faster
6. Pagination — Loads data in small chunks
7. Rate Limiting — Prevents API abuse
8. Idempotency — Same request shouldn't create duplicate effects
9. Replication — Copies data across servers
10. Sharding — Splits large databases into smaller parts
11. Message Queues — Async communication between services
12. Kafka — High-throughput event streaming system
13. Microservices — Break application into independent services
14. Distributed Locking — Prevents concurrent conflicts across servers
15. Consistency vs Availability — Core distributed system trade-off
16. WebSockets — Real-time two-way communication
17. Circuit Breaker — Stops cascading failures
18. Retry & Backoff — Handles temporary failures safely
19. CAP Theorem — Trade-off in distributed databases
20. Horizontal Scaling — Add more servers to handle load
21. Observability — Logs, metrics, tracing for debugging

Format each as: **Concept** — one-line definition. When to use it. Real-world example.`,
  },
  {
    id: 36,
    category: "Software Development",
    title: "MOCK SYSTEM DESIGN INTERVIEW",
    prompt:
`Act like a senior system design interviewer at a top tech company (Google, Meta, Amazon). Give me a real system to design (e.g., URL shortener, Twitter feed, ride-sharing app, video streaming platform, chat system).

Then guide me through the ideal solution covering:
• Requirements clarification (functional + non-functional)
• High-level architecture diagram
• API design
• Database schema and technology choice
• Scalability bottlenecks
• Caching strategy
• Trade-offs and alternatives

After each section I answer, give honest feedback and fill in what I missed. Make it feel like a real 45-minute interview.`,
  },
  {
    id: 37,
    category: "Software Development",
    title: "DEEP DIVE ANY SYSTEM DESIGN CONCEPT",
    prompt:
`Act like a staff engineer explaining [SYSTEM DESIGN CONCEPT, e.g., Kafka, Sharding, CAP Theorem, Circuit Breaker, Rate Limiting] in complete depth.

Cover:
• What it is and why it exists
• How it works internally step by step
• When to use it vs alternatives
• Real-world implementation examples
• Common pitfalls and gotchas
• How it fits into a larger distributed system

Explain it at the level that would impress a senior engineer at a top tech company.`,
  },

  // ── Interview Questions ────────────────────────────────────────────────────
  {
    id: 38,
    category: "Interview Questions",
    title: "GENERATE INTERVIEW QUESTIONS FOR ANY ROLE",
    prompt:
`Act like a senior hiring manager at a top tech company. Generate 20 interview questions for a [JOB TITLE/ROLE] position.

Include:
• 5 technical/hard skills questions
• 5 system design or architecture questions
• 5 behavioral questions (STAR format)
• 5 situational/problem-solving questions

For each question, explain what the interviewer is really trying to assess and what a strong answer looks like.`,
  },
  {
    id: 39,
    category: "Interview Questions",
    title: "MOCK TECHNICAL INTERVIEW",
    prompt:
`Act like a senior engineer conducting a real technical interview at a top tech company. Give me a coding problem suited for [JUNIOR / MID / SENIOR] level.

Walk me through it step by step:
• Understand the problem and clarify edge cases
• Think through the brute force first
• Optimize the approach
• Write clean, working code
• Analyze time and space complexity
• Suggest further optimizations

After I submit my solution, give honest feedback like a real interviewer would — what I got right, what I missed, and what would have impressed them.`,
  },
  {
    id: 40,
    category: "Interview Questions",
    title: "PERFECT BEHAVIORAL INTERVIEW ANSWERS",
    prompt:
`Act like an interview coach who has helped hundreds of engineers land offers at top tech companies. Help me craft a perfect STAR-format answer to this behavioral question: [QUESTION, E.G., "Tell me about a time you failed", "Describe a conflict with a teammate", "Tell me about a project you're most proud of"].

Make the answer:
• Specific and concrete with real details
• Results-focused with measurable outcomes
• Authentic and not over-polished
• Under 2 minutes when spoken aloud

Then give me feedback on how to improve it further.`,
  },
  {
    id: 41,
    category: "Interview Questions",
    title: "EXPLAIN HOW TO ANSWER ANY INTERVIEW QUESTION",
    prompt:
`I have an upcoming interview for [ROLE]. Break down exactly how to answer this question perfectly: [INTERVIEW QUESTION].

Cover:
• What the interviewer is really testing
• The ideal answer structure
• Key points and keywords to include
• Common mistakes candidates make
• A sample strong answer I can adapt

Make the advice specific and actionable — not generic career advice.`,
  },
  {
    id: 42,
    category: "Interview Questions",
    title: "CRACK THE SALARY NEGOTIATION",
    prompt:
`Act like a career coach who has helped hundreds of engineers negotiate salaries at top tech companies. I just received an offer for [ROLE] at [COMPANY] offering [SALARY + EQUITY].

Help me:
• Evaluate if this offer is competitive for the market
• Build a counter-offer negotiation strategy
• Write the exact email or script to counter
• Handle common pushback responses word-for-word
• Know when to push harder vs when to accept

Give me word-for-word scripts I can actually use in the conversation.`,
  },
  {
    id: 43,
    category: "Interview Questions",
    title: "BUILD A 30-DAY INTERVIEW PREP PLAN",
    prompt:
`Act like a senior engineering manager who has interviewed 500+ candidates. Build me a complete 30-day interview prep plan for a [ROLE] interview at [TARGET COMPANY, e.g., Google, Meta, startup].

Break it into 4 weekly phases:
• Week 1: Foundation (data structures, algorithms basics)
• Week 2: Intermediate patterns (dynamic programming, graphs)
• Week 3: System design + behavioral stories
• Week 4: Mock interviews + weak area drilling

For each day include: what to study, specific resources, and a practice problem or exercise. Focus on the 20% of topics that appear in 80% of real interviews.`,
  },

  // ── Learning ───────────────────────────────────────────────────────────────
  {
    id: 7,
    category: "Learning",
    title: "LEARN ANYTHING IN 20 HOURS",
    prompt:
      "I need to learn [topic] fast. Build me a 20-hour plan focused on the 20% that drives 80% of results. Break it into 10 two-hour sessions with the best resources and a 15-minute review at the end of each.",
  },
  {
    id: 8,
    category: "Learning",
    title: "CREATE A ONE-PAGE CHEAT SHEET",
    prompt:
      "Summarize the key concepts of [topic] on a single page. Use bullet points, diagrams, and examples so I can review it in 5 minutes.",
  },
  {
    id: 9,
    category: "Learning",
    title: "QUIZ ME UNTIL I BREAK",
    prompt:
      "I just studied [topic]. Give me 10 progressively harder questions to test my understanding. After each answer, grade me and explain what I missed.",
  },
  {
    id: 10,
    category: "Learning",
    title: "BUILD A LEARNING LADDER",
    prompt:
      "Break [topic] into 5 levels of difficulty. Show me how to go from Level 1 (beginner) to Level 5 (advanced) with a clear milestone at each step.",
  },
  {
    id: 11,
    category: "Learning",
    title: "FIND THE BEST LEARNING RESOURCES",
    prompt:
      "List the top 5 resources (books, videos, courses, or people) for learning [topic] fast, and explain why each is worth my time.",
  },
  {
    id: 12,
    category: "Learning",
    title: "USE THE FEYNMAN TECHNIQUE",
    prompt:
      "Explain [topic] to me in the simplest terms. Then have me re-explain it back. Point out gaps, re-teach what I miss, and repeat until I can explain it clearly on my own.",
  },
  {
    id: 48,
    category: "Learning",
    title: "GAMIFY LEARNING",
    prompt:
      "I'm studying [insert subject]. Turn it into a game — give me characters, a storyline, and challenges based on the topics, so that learning feels like leveling up instead of memorizing facts. Make each level harder than the last and reward me with a \"rank\" as I progress.",
  },

  // ── Self-Improvement ────────────────────────────────────────────────────────
  {
    id: 44,
    category: "Self-Improvement",
    title: "MIND READER PROTOCOL",
    prompt:
`Analyze my communication patterns based on our conversation so far.

• Identify my thinking style
• Decision-making patterns
• Hidden strengths
• Blind spots I'm ignoring

Be brutally honest.`,
  },
  {
    id: 45,
    category: "Self-Improvement",
    title: "80/20 ACCELERATOR",
    prompt:
`I want to master [skill] fast.

• Identify the 20% inputs
• That generate 80% results
• Remove unnecessary learning
• Give unconventional shortcuts

Focus on speed, not theory.`,
  },
  {
    id: 46,
    category: "Self-Improvement",
    title: "COMPETITIVE FRAMEWORK",
    prompt:
`Help me identify where I'm limiting myself in [area].

• What patterns hold me back?
• What constraints are self-created?
• What's the breakthrough move?

Design a strategy to break it.`,
  },
  {
    id: 47,
    category: "Self-Improvement",
    title: "FUTURE PROJECTION ENGINE",
    prompt:
`Based on my current actions...

• Where will I be in 3 years?
• What mistakes will cost me most?
• What should I change immediately?

Be direct. No sugarcoating.`,
  },
];
