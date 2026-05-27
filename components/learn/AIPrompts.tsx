"use client";

import Image from "next/image";
import { useState } from "react";
import type React from "react";

interface PromptItem {
  id: number;
  category: string;
  title: string;
  image?: string;
  imageAlt?: string;
  prompt: string;
}

const PROMPTS: PromptItem[] = [
  // ── Image Effects ──────────────────────────────────────────────────────────
  {
    id: 1,
    category: "Image Effects",
    title: "MS PAINT EFFECT",
    image: "/prompts/ms-paint.png",
    imageAlt: "MS Paint style redraw result",
    prompt:
      "Redraw the attached image in the most clumsy, scribbly, and utterly pathetic way possible. Use a white background, and make it look like it was drawn in an old computer painting program with a mouse. It should be vaguely similar but also not really, kind of matching but also off in a confusing, awkward way, with that low-quality pixel-by-pixel feel that really emphasizes how ridiculously bad it is. Actually, you know what, whatever, just draw it however you want. MS paint type",
  },
  {
    id: 2,
    category: "Image Effects",
    title: "SKIN ENHANCER",
    image: "/prompts/skin_enhancer.png",
    imageAlt: "Skin enhancer before and after result",
    prompt:
      "Skin enhancement retouch, preserve original identity and structure, refine skin texture without smoothing, maintain pores, freckles, and natural variation, reduce temporary blemishes and redness only, even out tone subtly without flattening depth, retain natural highlights and shadow transitions, keep under-eye detail intact with slight softening not removal, avoid plastic or airbrushed finish, maintain original lighting and color balance, enhance micro-contrast for realistic texture, lips and eyes untouched except for natural clarity, no reshaping of facial features, no artificial glow, no over-sharpening, seamless integration with original image, invisible edit with high realism.",
  },
  {
    id: 3,
    category: "Image Effects",
    title: "MINECRAFT EFFECT",
    image: "/prompts/minecraft.png",
    imageAlt: "Minecraft effect before and after result",
    prompt:
      "Keep the human subject 100 percent photorealistic and untouched. No pixel filter, no stylization, no lighting remap on skin. Preserve exact facial detail, pores, fabric weave, hair strands, natural shadows. Expression and posture remain identical. Rebuild the background as a structurally accurate Minecraft voxel replica of the original location. Do not reinterpret. Match the exact layout, spacing, depth, and geometry from the reference image. If there is a path, replicate its exact curve and width using gravel or dirt blocks. If there are trees, match trunk positions, height ratios, canopy spread using appropriate log and leaf blocks. If there are buildings, recreate their silhouette, window placement, roof angle using Minecraft block geometry. If there are rocks, benches, fences, signs, convert them into block equivalents but maintain their exact position and proportion relative to the subject. Perspective must match the original photo perfectly. Horizon line, camera height, focal distance, framing, subject scale all identical. Any object physically touching the subject must convert into Minecraft logic.",
  },
  {
    id: 4,
    category: "Image Effects",
    title: "GROUP SELFIE",
    image: "/prompts/group_selfie.png",
    imageAlt: "Group selfie AI generated result",
    prompt:
      "Raw iPhone selfie, subjects from reference images standing close together, both leaning slightly into frame, casual shoulder-to-shoulder composition, direct gaze into camera with relaxed neutral expressions, handheld at arm's length with slight upward tilt, soft indoor lighting mixed with phone flash causing mild overexposure on highlights and shadow falloff, natural skin texture visible with pores and subtle makeup detail, stray hairs and fabric creases present, background loosely visible with everyday environment elements slightly out of focus, minor motion blur in edges, slight lens distortion from close proximity, off-center framing with imperfect crop, subtle ISO grain and uneven white balance, unpolished, candid realism.",
  },
  {
    id: 5,
    category: "Image Effects",
    title: "LEGO EFFECT",
    image: "/prompts/lego_effect.png",
    imageAlt: "LEGO effect before and after result",
    prompt:
      "Keep the human subject 100 percent photorealistic and untouched. No pixel filter, no stylization, no lighting remap on skin. Preserve exact facial detail, pores, fabric weave, hair strands, natural shadows. Expression and posture remain identical. Rebuild the background as a structurally accurate LEGO replica of the original location. Do not reinterpret. Match the exact layout, spacing, depth, and geometry from the reference image. If there is a path, replicate its exact curve and width using LEGO tile and plate construction. If there are trees, match trunk positions, height ratios, canopy spread using appropriate LEGO trunk builds and layered foliage elements. If there are buildings, recreate their silhouette, window placement, roof angle using authentic LEGO architecture geometry and brick proportions. If there are rocks, benches, fences, signs, convert them into LEGO-built equivalents but maintain their exact position and proportion relative to the subject. Perspective must match the original photo perfectly. Horizon line, camera height, focal distance, framing, subject scale all identical. Any object physically touching the subject must convert into LEGO logic. Real animal becomes a LEGO animal or molded figure equivalent. Held object becomes a brick-built version scaled correctly to the hand. Objects not touching the subject remain LEGO-built but positioned exactly where they appear in the reference. Lighting recreated as realistic daylight interacting with LEGO plastic materials while matching the direction and intensity of the original photo. Preserve subtle specular highlights on LEGO surfaces, natural shadow falloff, soft environmental reflections, and realistic material response. If fog exists, rebuild it using layered atmospheric haze while preserving the same depth falloff. Maintain recognizable background identity. The location should be immediately identifiable from composition alone, just rendered in detailed LEGO construction. High-resolution cinematic realism. Realistic LEGO material texture with visible seams, studs, injection molding detail, slight surface scuffs, authentic plastic reflections. No UI, no text, no overlays.",
  },
  {
    id: 6,
    category: "Image Effects",
    title: "4K EFFECT",
    image: "/prompts/4k.png",
    imageAlt: "4K enhancement before and after result",
    prompt:
      "Ultra-high-resolution 4K enhancement based strictly on the provided reference image. Absolute fidelity to original facial anatomy, proportions, and identity. Preserve expression, gaze, pose, camera angle, framing, and perspective with zero deviation. Clothing, hair, skin, and background elements must remain unchanged in structure, placement, and design. Recover fine-grain detail with natural realism. Enhance pores, fine lines, hair strands, eyelashes, fabric weave, seams, and material edges without introducing stylization. Maintain original color science, white balance, and tonal relationships exactly as captured. Lighting direction, intensity, contrast, and shadow behavior must match the source image precisely, with only improved clarity and expanded dynamic range. No relighting, no reshaping. Remove any grain. Apply controlled sharpening and high-frequency detail reconstruction. Remove compression artifacts and noise while retaining authentic texture. No smoothing, no plastic skin, no artificial gloss. Facial features must remain consistent across the entire image with coherent anatomy and clean, stable edges. Negative constraints: no warping, no facial drift, no added or missing anatomy, no altered hands, no distortions, no perspective shift, no text or graphics, no hallucinated detail, no stylized rendering. Output must read as a true-to-life, photorealistic upscale that matches the reference exactly, only clearer, sharper, and higher resolution.",
  },

  {
    id: 27,
    category: "Image Effects",
    title: "CHANGE HAIRSTYLE",
    image: "/prompts/change_hairstyle.png",
    imageAlt: "Change hairstyle before and after result",
    prompt:
      "Change the person's hairstyle in this photo to [DESIRED HAIRSTYLE, SUCH AS LONG WAVY HAIR, SHORT BOB, CURLY HAIR, STRAIGHT HAIR, PONYTAIL, BANGS, BUZZ CUT, LAYERED HAIR, SLICKED-BACK HAIR, OR SHOULDER-LENGTH HAIR]. Keep the person's face, identity, facial features, expression, pose, clothing, skin texture, lighting, shadows, camera angle, and background the same. Make the new hairstyle look natural, with realistic texture, volume, hairline, parting, flyaways, highlights, and shadows that match the original photo. Do not change the face, alter facial proportions, distort the head or ears, over-smooth the skin, or make the hair look fake. The final image should look like a seamless, photo-realistic image of the same person with the requested hairstyle.",
  },
  {
    id: 28,
    category: "Image Effects",
    title: "FASHION VISUALIZATION",
    image: "/prompts/fashion_visualizer.png",
    imageAlt: "Fashion visualization before and after result",
    prompt:
      "Dress the person in the first image with the clothing from the second image. Keep the person's face, identity, expression, pose, body proportions, skin texture, hairstyle, lighting, shadows, camera angle, background, and overall photo style the same. Preserve the design, color, material, fit, and style of the clothing from the second image as accurately as possible. Make the clothing look naturally worn on the person's body, with realistic fabric draping, folds, seams, wrinkles, texture, colors, and shadows that match the pose and lighting of the first image. Do not change the face, reshape the body, alter the pose, distort hands or limbs, warp the background, or make the clothing look fake or pasted on. The final image should look like a seamless, photo-realistic image of the same person naturally wearing the clothing from the second image.",
  },
  {
    id: 29,
    category: "Image Effects",
    title: "CORRECT POSTURE",
    image: "/prompts/correct_posture.png",
    imageAlt: "Correct posture before and after result",
    prompt:
      "Subtle correction of body posture. Shoulders back and down, chest slightly elevated, head naturally aligned over the shoulders. Aligned spine. Maintain natural, confident, and relaxed body language. Clothing: realistic fabric drape adjusted to the new posture. Preserve original face, identity, background, and lighting. Final result: identical photo with improved and natural posture.",
  },
  {
    id: 30,
    category: "Image Effects",
    title: "CHANGE EXPRESSION",
    image: "/prompts/change_expression.png",
    imageAlt: "Change expression before and after result",
    prompt:
      "Change the facial expression of the person in this photo to [DESIRED EXPRESSION — E.G., SMILING, SURPRISED, LAUGHING, ETC.]. Keep the person's identity, facial features, and overall lighting intact while making the expression look natural and realistic. Ensure the adjustment blends seamlessly with the original image.",
  },
  {
    id: 31,
    category: "Image Effects",
    title: "CLOTHING COLOR CHANGE",
    image: "/prompts/clothing_change.png",
    imageAlt: "Clothing color change before and after result",
    prompt:
      "Change the color of the outfit from [CURRENT] to [TARGET]. 100% preservation of non-clothing elements: face, skin, hair, accessories, and environment. Precise identification of fabric edges. Light interaction: maintain tonal range, highlights, shadows, and texture (denim, silk, cotton). Wrinkles and drape remain unchanged. No color bleeding onto the skin. Result: photorealistic and undetectable.",
  },
  {
    id: 32,
    category: "Image Effects",
    title: "ANIME EFFECT",
    image: "/prompts/anime_effect.png",
    imageAlt: "Anime effect before and after result",
    prompt:
      "Anime style transformation, convert the reference image into detailed hand-drawn anime while preserving exact composition, same camera angle, framing, pose, and character proportions unchanged, maintain identical facial structure and expression translated into anime aesthetics, clean linework with controlled variation in line weight, large expressive eyes styled naturally to match original gaze direction, simplified but accurate nose and mouth, hair reinterpreted into defined anime strands while keeping original shape and flow, skin rendered with smooth tonal shading and soft gradients, lighting direction and intensity preserved from original image, colors slightly stylized but faithful to source palette, background converted into anime environment matching original depth and perspective, subtle cel shading with gentle highlights, no distortion of anatomy or perspective, no change in crop or zoom, high fidelity adaptation rather than reinterpretation.",
  },
  {
    id: 33,
    category: "Image Effects",
    title: "PRODUCT AD",
    image: "/prompts/product_ad.png",
    imageAlt: "Product ad transformation result",
    prompt:
      "Product studio transformation, isolate the product from the reference image and rebuild as a premium ad composition, hero product centered and sharply in focus, surrounded by its key ingredients arranged with intention and depth, ingredients fresh and tactile, sliced, crushed, or whole depending on context, composition balanced but not perfectly symmetrical, clean surface with subtle reflections, background designed to match the product's color palette and mood, soft gradients or tonal transitions, high-end studio lighting with controlled highlights and gentle shadow falloff, crisp edges with slight natural shadow grounding the product, micro-details visible like condensation, texture on ingredients, and line surface imperfections, minimal but intentional negative space, no clutter beyond ingredients, polished commercial finish without looking artificial, accurate color rendering and realistic material response.",
  },
  {
    id: 34,
    category: "Image Effects",
    title: "GTA EFFECT",
    image: "/prompts/gta_effect.png",
    imageAlt: "GTA V effect before and after result",
    prompt:
      "Rebuild the entire scene from the reference image as a real-time 3D render inside the GTA V Rage engine. Do not apply a filter. Fully reconstruct all people, vehicles, architecture, terrain, and props as polygonal 3D assets native to GTA V. The result should look like an authentic in-game screenshot captured on a high-end PC, ultra settings enabled. All subjects must be converted into clearly modeled geometry with visible polygon structure, baked normal maps, and game-accurate textures. Faces, bodies, and clothing should follow GTA V character proportions and anatomy, slightly exaggerated, rigid, and digitally sculpted. Skin is matte and textured, no photographic pores. Hair is clumped, card-based, slightly stiff. Clothing uses flat fabric shaders with visible seams and texture repetition. Environment must feel like Los Santos or Blaine County logic. Buildings are modular, edges slightly sharp, surfaces tiled and optimized. Roads, sidewalks, vegetation, street props, and background elements are simplified but dense, clearly game-built constructed. No real-world photographic depth or lens artifacts. Lighting follows GTA V real-time lighting behavior. Strong directional sunlight or overcast skylight depending on scene. Hard shadows with defined edges, subtle ambient occlusion in corners. Reflections are screen-space and imperfect. Colors are slightly saturated with the recognizable GTA V color grading. Contrast is controlled but punchy. Materials must read as video game assets. Asphalt is flat and grainy. Metal has simple specular highlights. Glass is clean with limited reflection depth. Vegetation is slightly stiff and stylized. Nothing should appear physically accurate or cinematic-render realistic. Camera should feel like a gameplay or Rockstar Editor capture. Third-person or free camera perspective. Slight wide-angle distortion. Stable framing. No depth of field blur. No motion blur unless minimal and engine-based. Overall look is unmistakably GTA V. Real-time 3D. Polygon. Textured. Optimized. Stylized realism. Clearly not a photograph.",
  },

  {
    id: 23,
    category: "Image Effects",
    title: "HAIRLINE RESTORATION",
    image: "/prompts/hairline_restoration.png",
    imageAlt: "Hairline restoration before and after result",
    prompt:
      "Natural and subtle hair restoration from the base photo. Fill in temples and frontal hairline with identical color, texture, and density. Lower the hairline by 5-15mm to a natural M-shaped or rounded position. Preserve original hairstyle, facial features, and expression. Final image: exact photo, hair subtly denser and more youthful, undetectable editing.",
  },
  {
    id: 24,
    category: "Image Effects",
    title: "CHANGE POSE",
    image: "/prompts/change_pose.png",
    imageAlt: "Change pose before and after result",
    prompt:
      "Change the person's pose in this photo to [DESIRED POSE, SUCH AS SITTING CROSS-LEGGED, ARMS CROSSED, WALKING FORWARD, JUMPING MID-AIR, LEANING AGAINST A WALL, LOOKING OVER THE SHOULDER, HANDS IN POCKETS, OR HOLDING AN OBJECT]. Keep the person's face, identity, facial features, expression, body proportions, clothing, skin texture, hairstyle, lighting, shadows, camera angle, background, and overall photo style as consistent as possible. Make the new pose look natural, balanced, and anatomically realistic, with believable limb placement, body weight, posture, clothing folds, contact points, and shadows that match the original scene. Do not distort the face, warp the body, create extra fingers or limbs, change the person's identity, alter the background, or make the pose look stiff or artificial. The final image should look like a seamless, photo-realistic image of the same person naturally captured in the requested pose.",
  },
  {
    id: 25,
    category: "Image Effects",
    title: "REMOVE DARK CIRCLES",
    image: "/prompts/dark_spot.png",
    imageAlt: "Remove dark circles before and after result",
    prompt:
      "Subtle reduction of dark circles and eye bags from the base photo. Lighten pigmentation, soften slight puffiness, and dim shadows. Naturally blend the tone of the dark circles with the cheeks. Maintain the natural eye crease, bone structure, and expression lines. Correct only darkness and inflammation. No general beauty filters. Result: bright, rested, and natural eyes.",
  },
  {
    id: 26,
    category: "Image Effects",
    title: "EDIT TEXT IN IMAGE",
    image: "/prompts/edit_text.png",
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
];

const CATEGORIES = Array.from(new Set(PROMPTS.map((p) => p.category)));

const PROMPT_VISUALS: Record<string, { gradient: string; icon: React.ReactNode }> = {
  "TURN CLAUDE INTO A FULL STARTUP ENGINEERING TEAM": {
    gradient: "from-cyan-500 to-blue-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" />
        <line x1="24" y1="32" x2="24" y2="42" />
        <line x1="18" y1="42" x2="30" y2="42" />
      </svg>
    ),
  },
  "TURN CLAUDE INTO A PRODUCTION-LEVEL DEBUGGING MONSTER": {
    gradient: "from-red-500 to-rose-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="24" cy="26" rx="9" ry="11" />
        <path d="M18 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <line x1="15" y1="22" x2="9" y2="18" />
        <line x1="15" y1="30" x2="9" y2="30" />
        <line x1="15" y1="36" x2="9" y2="40" />
        <line x1="33" y1="22" x2="39" y2="18" />
        <line x1="33" y1="30" x2="39" y2="30" />
        <line x1="33" y1="36" x2="39" y2="40" />
        <circle cx="21" cy="24" r="1.5" fill="white" stroke="none" />
        <circle cx="27" cy="24" r="1.5" fill="white" stroke="none" />
      </svg>
    ),
  },
  "TURN CLAUDE INTO A PERFORMANCE OPTIMIZATION ENGINEER": {
    gradient: "from-yellow-500 to-orange-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 36a20 20 0 0 1 32 0" />
        <line x1="24" y1="36" x2="24" y2="20" />
        <line x1="24" y1="36" x2="34" y2="26" />
        <circle cx="24" cy="36" r="3" fill="white" stroke="none" opacity="0.5" />
        <line x1="8" y1="36" x2="6" y2="36" />
        <line x1="40" y1="36" x2="42" y2="36" />
        <line x1="24" y1="16" x2="24" y2="14" />
        <line x1="14" y1="19" x2="13" y2="17.4" />
        <line x1="34" y1="19" x2="35" y2="17.4" />
      </svg>
    ),
  },
  "MAKE CLAUDE REBUILD MESSY CODE INTO CLEAN SCALABLE ARCHITECTURE": {
    gradient: "from-teal-500 to-cyan-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="14" height="10" rx="2" />
        <rect x="26" y="8" width="14" height="10" rx="2" />
        <rect x="17" y="30" width="14" height="10" rx="2" />
        <line x1="15" y1="18" x2="24" y2="30" />
        <line x1="33" y1="18" x2="24" y2="30" />
      </svg>
    ),
  },
  "MAKE CLAUDE ARCHITECT YOUR ENTIRE STARTUP BACKEND": {
    gradient: "from-blue-600 to-indigo-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="24" cy="12" rx="14" ry="5" />
        <path d="M10 12v8c0 2.8 6.3 5 14 5s14-2.2 14-5v-8" />
        <path d="M10 20v8c0 2.8 6.3 5 14 5s14-2.2 14-5v-8" />
        <path d="M10 28v8c0 2.8 6.3 5 14 5s14-2.2 14-5v-8" />
      </svg>
    ),
  },
  "TURN CLAUDE INTO AN ENTIRE AI ENGINEERING TEAM": {
    gradient: "from-purple-500 to-violet-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="12" r="5" />
        <circle cx="10" cy="34" r="5" />
        <circle cx="38" cy="34" r="5" />
        <line x1="24" y1="17" x2="24" y2="26" />
        <line x1="24" y1="26" x2="10" y2="29" />
        <line x1="24" y1="26" x2="38" y2="29" />
        <circle cx="24" cy="26" r="3" fill="white" stroke="none" opacity="0.3" />
      </svg>
    ),
  },
  "TURN CLAUDE INTO A SENIOR FRONTEND ENGINEER": {
    gradient: "from-sky-500 to-cyan-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="10" width="36" height="24" rx="3" />
        <line x1="18" y1="38" x2="30" y2="38" />
        <line x1="24" y1="34" x2="24" y2="38" />
        <polyline points="14,22 20,28 28,18" />
        <line x1="30" y1="22" x2="36" y2="22" />
        <line x1="30" y1="26" x2="34" y2="26" />
      </svg>
    ),
  },
  "AI TECHNICAL LEAD MODE": {
    gradient: "from-amber-500 to-yellow-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="16" r="7" />
        <path d="M10 42c0-7.7 6.3-14 14-14s14 6.3 14 14" />
        <polyline points="30,10 34,14 38,8" />
      </svg>
    ),
  },
  "PRODUCTION SECURITY AUDIT": {
    gradient: "from-slate-600 to-gray-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6l14 5v10c0 9-6 17-14 21C16 38 10 30 10 21V11z" />
        <polyline points="18,24 22,28 30,18" />
      </svg>
    ),
  },
  "SENIOR DEVOPS + DEPLOYMENT ENGINEER": {
    gradient: "from-green-500 to-emerald-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 20c0-4.4-3.6-8-8-8s-8 3.6-8 8c-4 0-7 3-7 7s3 7 7 7h16c4 0 7-3 7-7s-3-7-7-7z" />
        <line x1="24" y1="28" x2="24" y2="38" />
        <polyline points="20,34 24,38 28,34" />
      </svg>
    ),
  },
  "LEARN ANYTHING IN 20 HOURS": {
    gradient: "from-violet-600 to-indigo-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="18" />
        <polyline points="24,12 24,24 32,28" />
        <path d="M16 6.5 Q24 2 32 6.5" strokeDasharray="2 2" />
      </svg>
    ),
  },
  "CREATE A ONE-PAGE CHEAT SHEET": {
    gradient: "from-emerald-500 to-teal-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="6" width="28" height="36" rx="3" />
        <line x1="16" y1="16" x2="32" y2="16" />
        <line x1="16" y1="22" x2="32" y2="22" />
        <line x1="16" y1="28" x2="26" y2="28" />
        <circle cx="33" cy="35" r="5" fill="white" stroke="none" opacity="0.25" />
        <path d="M30 35l2 2 4-4" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  "QUIZ ME UNTIL I BREAK": {
    gradient: "from-rose-500 to-orange-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="20" r="12" />
        <path d="M20 17c0-2.2 1.8-4 4-4s4 1.8 4 4c0 2-2 3-2 5h-4" />
        <circle cx="24" cy="25" r="1" fill="white" stroke="none" />
        <path d="M17 36l7-8 7 8" />
        <line x1="24" y1="36" x2="24" y2="42" />
      </svg>
    ),
  },
  "BUILD A LEARNING LADDER": {
    gradient: "from-amber-500 to-yellow-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="14" y1="8" x2="14" y2="42" />
        <line x1="34" y1="8" x2="34" y2="42" />
        <line x1="14" y1="16" x2="34" y2="16" />
        <line x1="14" y1="24" x2="34" y2="24" />
        <line x1="14" y1="32" x2="34" y2="32" />
        <line x1="14" y1="40" x2="34" y2="40" />
        <circle cx="34" cy="8" r="4" fill="white" stroke="none" opacity="0.3" />
        <path d="M32 8l1.5 1.5L36 7" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  "FIND THE BEST LEARNING RESOURCES": {
    gradient: "from-sky-500 to-blue-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="21" cy="20" r="11" />
        <line x1="29" y1="29" x2="40" y2="40" />
        <line x1="16" y1="20" x2="26" y2="20" />
        <line x1="21" y1="15" x2="21" y2="25" />
      </svg>
    ),
  },
  "USE THE FEYNMAN TECHNIQUE": {
    gradient: "from-fuchsia-500 to-pink-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6c-7 0-12 5-12 11 0 4 2 7.5 5 9.5V30l4-2h3c7 0 12-5 12-11S31 6 24 6z" />
        <line x1="24" y1="34" x2="24" y2="42" />
        <line x1="20" y1="42" x2="28" y2="42" />
        <circle cx="24" cy="18" r="2" fill="white" stroke="none" opacity="0.6" />
      </svg>
    ),
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy prompt"}
      className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:text-[var(--accent)]"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 8.5l3.5 3.5 7-7" />
          </svg>
          <span className="text-emerald-500">Copied!</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path strokeLinecap="round" d="M5.5 10.5H4a1.5 1.5 0 01-1.5-1.5V4A1.5 1.5 0 014 2.5h5A1.5 1.5 0 0110.5 4v1.5" />
          </svg>
          Copy prompt
        </>
      )}
    </button>
  );
}

function PromptDrawer({ item, onClose }: { item: PromptItem | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-5">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{item.category}</span>
            <h2 className="truncate text-lg font-semibold leading-snug text-[var(--text)]">{item.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.imageAlt ?? item.title} className="h-auto w-full rounded-xl border border-[var(--border)]" />
          ) : PROMPT_VISUALS[item.title] ? (
            <div className={`flex h-48 items-center justify-center rounded-xl bg-gradient-to-br ${PROMPT_VISUALS[item.title].gradient}`}>
              {PROMPT_VISUALS[item.title].icon}
            </div>
          ) : null}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Prompt</span>
              <CopyButton text={item.prompt} />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3">
              <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--text)]">{item.prompt}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PromptCard({ item, onClick }: { item: PromptItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] text-left shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
    >
      {item.image ? (
        <div className="overflow-hidden">
          <Image
            src={item.image}
            alt={item.imageAlt ?? item.title}
            width={400}
            height={280}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : PROMPT_VISUALS[item.title] ? (
        <div className={`flex h-44 items-center justify-center bg-gradient-to-br ${PROMPT_VISUALS[item.title].gradient} transition duration-300 group-hover:brightness-110`}>
          {PROMPT_VISUALS[item.title].icon}
        </div>
      ) : null}
      <div className="flex flex-1 items-center px-4 py-4">
        <span className="text-sm font-semibold tracking-wide text-[var(--text)] group-hover:text-[var(--accent)]">
          {item.title}
        </span>
      </div>
    </button>
  );
}

export function AIPrompts() {
  const [active, setActive] = useState<PromptItem | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4">
        {CATEGORIES.map((category) => {
          const items = PROMPTS.filter((p) => p.category === category);
          return (
            <details
              key={category}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-sm open:[&_.cat-chevron]:rotate-180"
              open
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">{category}</h2>
                  <span className="rounded-full bg-[var(--elevated)] px-2 py-0.5 text-xs text-[var(--muted)]">
                    {items.length}
                  </span>
                </div>
                <svg
                  className="cat-chevron h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <PromptCard key={item.id} item={item} onClick={() => setActive(item)} />
                  ))}
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <PromptDrawer item={active} onClose={() => setActive(null)} />
    </>
  );
}
