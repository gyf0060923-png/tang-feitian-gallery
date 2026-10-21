# AI 修复示意：素材与提示词记录

生成方式：内置 imagegen 图像编辑工具；无 CLI/API 回退。

这些文件是基于展品原图生成的视觉示意，不是考古学复原、文物修复结果，也不是敦煌研究院作品。原图不覆盖；参照来源见网站每件展品链接。页面只在 AI 修复对照弹窗内显示示意图。

## 保存文件

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
