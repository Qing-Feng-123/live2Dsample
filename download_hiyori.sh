#!/bin/bash
# ============================================================
# 桃濑日和 (Hiyori Momose) - FREE 动作素材一键下载脚本
# 适用: Linux / macOS / Git Bash (Windows)
# 用法: bash download_hiyori.sh
# ============================================================

set -e

OUTPUT_DIR="hiyori_free_t08_full"
ZIP_NAME="hiyori_free_t08_full.zip"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo "  桃濑日和 动作素材 - 一键打包下载"
echo "============================================"
echo ""

# 清理旧输出
rm -rf "$OUTPUT_DIR" "$ZIP_NAME"

# 创建输出目录结构
mkdir -p "$OUTPUT_DIR/runtime/motion"
mkdir -p "$OUTPUT_DIR/runtime/hiyori_free_t08.2048"

echo "[1/5] 复制模型核心文件..."
cp "$SCRIPT_DIR/runtime/hiyori_free_t08.moc3"           "$OUTPUT_DIR/runtime/"
cp "$SCRIPT_DIR/runtime/hiyori_free_t08.model3.json"    "$OUTPUT_DIR/runtime/"
cp "$SCRIPT_DIR/runtime/hiyori_free_t08.physics3.json"  "$OUTPUT_DIR/runtime/"
cp "$SCRIPT_DIR/runtime/hiyori_free_t08.cdi3.json"      "$OUTPUT_DIR/runtime/"
cp "$SCRIPT_DIR/runtime/hiyori_free_t08_old.cdi3.json"  "$OUTPUT_DIR/runtime/"

echo "[2/5] 复制动作文件..."
cp "$SCRIPT_DIR/runtime/motion/"*.motion3.json          "$OUTPUT_DIR/runtime/motion/"

echo "[3/5] 复制贴图..."
cp "$SCRIPT_DIR/runtime/hiyori_free_t08.2048/texture_00.png" "$OUTPUT_DIR/runtime/hiyori_free_t08.2048/"

echo "[4/5] 复制组合模型和动画..."
cp "$SCRIPT_DIR/hiyori_free_t08.cmo3" "$OUTPUT_DIR/"
cp "$SCRIPT_DIR/hiyori_free_t03.can3" "$OUTPUT_DIR/"
cp "$SCRIPT_DIR/ReadMe.txt"           "$OUTPUT_DIR/"
cp "$SCRIPT_DIR/桃濑日和_动作素材文档.md" "$OUTPUT_DIR/"

echo "[5/5] 打包为 ZIP..."
if command -v zip &>/dev/null; then
    zip -r "$ZIP_NAME" "$OUTPUT_DIR" > /dev/null
    rm -rf "$OUTPUT_DIR"
    FILE_SIZE=$(ls -lh "$ZIP_NAME" | awk '{print $5}')
    echo ""
    echo "============================================"
    echo "  打包完成！"
    echo "  文件: $ZIP_NAME"
    echo "  大小: $FILE_SIZE"
    echo "  路径: $SCRIPT_DIR/$ZIP_NAME"
    echo "============================================"
    echo ""
    echo "包含内容:"
    echo "  - 模型核心数据 (.moc3)"
    echo "  - 模型设定文件 (.model3.json)"
    echo "  - 物理模拟设定 (.physics3.json)"
    echo "  - 参数/部件定义 (.cdi3.json)"
    echo "  - 组合模型 (.cmo3)"
    echo "  - 基本动画 (.can3)"
    echo "  - 8个动作文件 (.motion3.json)"
    echo "  - 2048分辨率贴图 (.png)"
    echo "  - 完整动作素材文档 (.md)"
    echo "  - 官方说明文档 (ReadMe.txt)"
else
    echo ""
    echo "============================================"
    echo "  文件已复制到: $OUTPUT_DIR/"
    echo "  (未安装 zip 命令，请手动打包)"
    echo "============================================"
    echo ""
    echo "手动打包: tar -czf hiyori_free_t08_full.tar.gz $OUTPUT_DIR/"
fi