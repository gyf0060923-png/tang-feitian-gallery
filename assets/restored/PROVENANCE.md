# AI 修复示意：素材与提示词记录

## 2026-10-21 吹横笛飞天缺失足部修正

### 最终展示方案：保留原图足部

原图足部区域与 AI 示意底图的明度、色温不同，因此网页保护层依据周边无轮廓区域的像素色值作统一 RGB 色调校准，并使用足部周边的窄范围软边遮罩。只调整显示色调，不改变原画的足部形状、脚趾方向或线条位置；不修改敦煌研究院原图文件。

用户指出两次生成的足部均与原画不符，因此两次生成的足部结果不再采用。恢复此前的修复示意底图；网页对照层使用 `restore.js` 内的 SVG 原图保护区域，在相同构图坐标保留敦煌研究院原图的足部、脚踝及其轮廓，覆盖底图对应区域。该区域直接显示原壁画细节，不再用生成模型重画，也不声称已完成足部文物修复。原始壁画文件保持不变。

以下为被否决的两次生成尝试记录，保留作溯源：

最终采用用户提供的原壁画足部放大图再次校正脚掌弯曲、脚踝角度和脚趾收拢。最终生成原件：`C:/Users/ASUS/.codex/generated_images/01a159ba-58a6-79a2-88e0-cbe7f77bea9b/exec-bee16742-c0c3-4119-9fac-c7c07bef79fd.png`。仍使用内置 imagegen，无 CLI/API 回退。

最终局部形态校正提示词：

Use case: precise-object-edit. Image 1 is the EDIT TARGET, the current full AI restoration visualization. Image 2 is the authentic full mural photograph for precise placement. Image 3 is the user's enlarged authentic crop showing the exact shape of the lower-left foot. Make only a localized correction to the newly restored LOWEST LEFT bare foot and ankle in image 1, below the brown skirt. The current foot is too straight and its toes too evenly spread. Closely trace the silhouette and pose in image 3: a short broad foot tilted down-left, with a bent/slightly flexed ankle, tightly grouped curved toes seen partly in side view, a rounded heel on the lower-right, and the calf extending up-right under the robe. Match the outline, proportions, toe grouping and angle of this original ancient mural foot rather than inventing a generic human foot. Keep it in the same position as in the full authentic mural, around normalized x .10-.27, y .82-.89. Do not enlarge it. Retain the other higher foot on top of the skirt exactly as it is; there are precisely TWO feet. Use the same restrained thin tan outline and muted pale flesh fill of image 1, preserving hand-painted mineral pigment and plaster texture. Preserve ALL other pixels as closely as possible: identical framing/aspect ratio, all ribbons, brown skirt, face, hands, flute, torso, jewellery, background and colours. Do not alter body pose, redesign clothing, add extra feet or legs, or modernize anatomy. Output the complete corrected image 1 only, not a crop, no labels or added text.

### 首次补回缺失足部

使用内置 imagegen 编辑工具，以原 AI 修复示意图为编辑对象、敦煌研究院原壁画为姿态参照，补回左下方缺失的第二只脚、脚踝及露出的小腿。输出已替换 `assets/restored/yulin-15-flute.png`，原始壁画未修改。生成原件：`C:/Users/ASUS/.codex/generated_images/01a159ba-58a6-79a2-88e0-cbe7f77bea9b/exec-2b50c30e-7d23-4603-a4a5-057f07e3611f.png`。

最终提示词：

Use case: precise-object-edit. Image 1 is the EDIT TARGET: the existing AI restoration visualization of the Yulin Cave 15 flute-playing apsara. Image 2 is the AUTHENTIC ORIGINAL REFERENCE for the exact missing anatomy, not a new style target. Correct ONE localized omission in image 1: restore the SECOND bare lower leg and foot extending down-left from beneath the brown skirt near the bottom-left. In image 2 it is clearly visible below the brown skirt: a faint calf angles left down to a foot with toes, around normalized x 0.11-0.29, y 0.82-0.89. Image 1 currently has empty beige plaster there; restore that same original leg/ankle/heel/foot/toes, connected naturally beneath the left portion of the brown garment, following the exact position and original pose in image 2. Keep the already present higher foot resting on the garment unchanged. There must be TWO feet as in the authentic reference, not one and not three. Match the restrained tan contour line, pale flesh fill, flat historic mural brushwork and aged plaster texture of image 1. Preserve image 1's exact framing, aspect ratio, body, face, hands, flute, jewelry, red and green ribbons, garment shapes, palette and all other details. This is a small precise anatomical correction, not a redesign or a new illustration. No text, border, labels, arrows or watermark. Output the full corrected image 1, not a crop.

生成方式：内置 imagegen 图像编辑工具；无 CLI/API 回退。

这些文件是基于展品原图生成的视觉示意，不是考古学复原、文物修复结果，也不是敦煌研究院作品。原图不覆盖；参照来源见网站每件展品链接。页面默认显示原图，开启 AI 修复开关后在主展台和缩略图中统一显示示意图；再次点击可恢复全部原图。

## 保存文件

### 2026-10-21 新增五幅

新增榆林25窟起舞飞天、莫高322窟藻井及龛顶飞天群、莫高39窟说法图飞天、莫高231窟藻井的修复视觉示意。使用内置 imagegen 编辑工具，输入为各自官方原图。逐幅最终提示词、输入与输出文件记录于 `ADDITIONS.json`。输出文件与原图同名（扩展名统一 PNG），保存于本目录。保留原构图和姿态，轻补小面积破损；它们不是敦煌研究院修复成果。

- `assets/restored/mogao-320-wall.png`，输入为 `assets/mogao-320-wall.jpg`。
- `assets/restored/mogao-320.png`，输入为 `assets/mogao-320.png`。
- `assets/restored/mogao-321-sky.png`，输入为 `assets/mogao-321-sky.png`。
- `assets/restored/mogao-321.png`，输入为 `assets/mogao-321.png`。
- `assets/restored/mogao-329-ceiling.png`，输入为 `assets/mogao-329-ceiling.png`。
- `assets/restored/yulin-15-flute.png`，输入为 `assets/yulin-15-flute.png`。
- `assets/restored/yulin-15-harp.png`，输入为 `assets/yulin-15-harp.png`。

## 散花飞天提示词

Use case: precise-object-edit. Edit target: the supplied authentic Dunhuang mural photograph, Mogao Cave 320, Tang apsaras scattering flowers. Create a conservative DIGITAL RESTORATION VISUALIZATION of this exact photograph for a before/after website comparison. Preserve the exact aspect ratio, framing, pixel-level alignment of all figures, all silhouettes, original flat mineral-pigment mural style and ornament positions. Repair small plaster losses, scratches, pigment flaking, clarify existing drawn contours, gently recover faded mineral green, cinnabar and ochre, keeping the source's restrained earthy palette and plaster texture. Do not replace or modernize faces, do not turn this into a new glamorous illustration or photographic people. Retain original age and brushwork. No new figures, no new scenery, no text, labels, borders, logos or watermark. Output one restored image only at the same composition and aspect ratio as the source. It will be clearly labeled AI restoration visualization in the application, never as an authentic historical reconstruction.

## 其余六幅提示词模板

Use case: precise-object-edit. Edit target: the supplied authentic Dunhuang mural photograph of {subject}. Create a conservative DIGITAL RESTORATION VISUALIZATION of this exact photograph for a before/after website comparison. Preserve exact aspect ratio, all four edges, framing, same locations and scale of all figures, original silhouettes and clothing, and the flat mineral-pigment mural style. Only mend visible plaster losses, cracks, pigment flaking, and faint contours by continuing adjacent patterns; keep the existing composition unchanged. Gently recover faded earth mineral pigments while retaining source colour relationships, aged plaster and hand-painted texture. Do not invent extra people or instruments. Preserve existing faces and anatomical poses; no glamorous modern illustration, realistic photographic faces, added 3D shading, gradients, gold jewellery or scenery. Do not crop or redesign any ornament. No text, labels, watermark, signature or borders. Output one single restored picture in the source aspect ratio. It will be labeled AI restoration visualization, not an authenticated reconstruction.

## 模板 subject 参数

- yulin-15-flute: a single flute-playing apsara in Yulin Cave 15, with looping red and green ribbons
- yulin-15-harp: the harp-playing apsara in Yulin Cave 15, damaged plaster and flowing ribbons
- mogao-329-ceiling: Mogao Cave 329 ceiling lotus and apsara pattern, seen exactly as photographed
- mogao-321: Mogao Cave 321 pair of flying apsaras beside the bodhi tree, blue-green mural
- mogao-321-sky: Mogao Cave 321 pure-land sky detail with floating musical instruments and apsaras
- mogao-320-wall: the complete Mogao Cave 320 south wall, rows of small Buddhas around the central preaching scene and flying apsaras above

## 新增6幅修复示意（全馆18幅）

使用内置 imagegen 逐张编辑第217窟穿楼飞天、第158窟云间飞天、第57窟宝池上双飞天，以及第329窟夜半逾城、乘象入胎、藻井与龛顶全景。保留源画幅、主体姿态与主要线条，修补小范围损伤并恢复矿物色层次；不推测大面积缺失面貌。全部是AI生成视觉示意，原照片未修改。完整最终提示词与输入输出记录见 `ADDITIONS_28.json`。

## 吹横笛飞天腹部裂痕修正

用户指出腹部锯齿状线是墙体裂痕。使用内置 imagegen 以现有AI示意为编辑目标、用户红框截图为定位参考，仅去除腹部裂痕并延续邻近肌肤色调与纹理，保留身体弧线、腰线、衣带、手势及全图构图。修正版单独保存为 `yulin-15-flute-crack-repaired.png`，`restore.js` 对所有看图工具和图册统一采用此图，并继续合成先前核对的原画足部。原始壁画不修改。完整提示词见 `ABDOMEN_29.json`。

## 展示文件编译（加载可靠性）

旧版 `restore.js` 中已确认的吹横笛飞天SVG足部保护，连同腹部裂痕修正版，使用同一浏览器渲染器在原像素尺寸导出，再做无损WebP编码。完整画幅解码RGBA核对一致，没有新增补绘或重画；修正后的脚、腹部、颜色及构图均编入 `assets/delivery` 展示资源。页面不再依赖多张大图与运行时SVG合成才能显示此作品。主展台、图册、放大镜、取色和粒子统一使用交付资源。
