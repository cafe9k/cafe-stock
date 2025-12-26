#!/bin/bash

# 安装 Git hooks 脚本
# 将 pre-commit hook 复制到 .git/hooks/ 目录

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"
PRE_COMMIT_SOURCE="$SCRIPT_DIR/git-hooks/pre-commit"
PRE_COMMIT_TARGET="$HOOKS_DIR/pre-commit"

echo "📦 安装 Git hooks..."

# 检查 .git/hooks 目录是否存在
if [ ! -d "$HOOKS_DIR" ]; then
  echo "❌ 错误: .git/hooks 目录不存在，请确保这是一个 Git 仓库。"
  exit 1
fi

# 检查源文件是否存在
if [ ! -f "$PRE_COMMIT_SOURCE" ]; then
  echo "❌ 错误: pre-commit hook 源文件不存在: $PRE_COMMIT_SOURCE"
  exit 1
fi

# 复制 pre-commit hook
cp "$PRE_COMMIT_SOURCE" "$PRE_COMMIT_TARGET"
chmod +x "$PRE_COMMIT_TARGET"

echo "✅ Git hooks 安装成功！"
echo ""
echo "📝 已安装的 hooks:"
echo "   - pre-commit: 提交前验证分形文档结构"
echo ""
echo "💡 提示："
echo "   - 每次提交前会自动检查文档完整性"
echo "   - 如需跳过检查，使用: git commit --no-verify"
echo "   - 卸载 hooks: rm .git/hooks/pre-commit"

