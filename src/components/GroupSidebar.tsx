/**
 * 分组侧边栏组件
 */

import { useState } from 'react'
import type { WatchGroup } from '../types/database'
import './GroupSidebar.css'

interface GroupSidebarProps {
    groups: WatchGroup[]
    selectedGroupId: string | null
    stockCounts: Map<string, number>  // 每个分组的股票数量
    totalCount: number
    onSelectGroup: (groupId: string | null) => void
    onCreateGroup: (name: string, color?: string) => Promise<WatchGroup | null>
    onUpdateGroup: (id: string, updates: { name?: string; color?: string }) => Promise<boolean>
    onDeleteGroup: (id: string) => Promise<boolean>
}

const PRESET_COLORS = [
    '#58a6ff', // 蓝色
    '#f85149', // 红色
    '#3fb950', // 绿色
    '#d29922', // 橙色
    '#a371f7', // 紫色
    '#db61a2', // 粉色
    '#8b949e', // 灰色
    '#79c0ff', // 浅蓝
]

export default function GroupSidebar({
    groups,
    selectedGroupId,
    stockCounts,
    totalCount,
    onSelectGroup,
    onCreateGroup,
    onUpdateGroup,
    onDeleteGroup,
}: GroupSidebarProps) {
    const [showAddForm, setShowAddForm] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupColor, setNewGroupColor] = useState(PRESET_COLORS[0])
    const [creating, setCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')

    // 创建分组
    const handleCreate = async () => {
        if (!newGroupName.trim()) return

        setCreating(true)
        try {
            const result = await onCreateGroup(newGroupName.trim(), newGroupColor)
            if (result) {
                setNewGroupName('')
                setNewGroupColor(PRESET_COLORS[0])
                setShowAddForm(false)
            }
        } finally {
            setCreating(false)
        }
    }

    // 开始编辑
    const handleStartEdit = (group: WatchGroup, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingId(group.id)
        setEditName(group.name)
    }

    // 保存编辑
    const handleSaveEdit = async (id: string) => {
        if (!editName.trim()) {
            setEditingId(null)
            return
        }

        await onUpdateGroup(id, { name: editName.trim() })
        setEditingId(null)
    }

    // 删除分组
    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('确定要删除这个分组吗？分组内的股票将移至未分组。')) {
            await onDeleteGroup(id)
        }
    }

    return (
        <aside className="group-sidebar">
            <div className="sidebar-header">
                <h2>分组</h2>
                <button
                    className="btn-add-group"
                    onClick={() => setShowAddForm(!showAddForm)}
                    title="新建分组"
                >
                    {showAddForm ? '×' : '+'}
                </button>
            </div>

            {/* 新建分组表单 */}
            {showAddForm && (
                <div className="add-group-form">
                    <input
                        type="text"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="分组名称"
                        maxLength={20}
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    />
                    <div className="color-picker">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color}
                                className={`color-option ${newGroupColor === color ? 'active' : ''}`}
                                style={{ background: color }}
                                onClick={() => setNewGroupColor(color)}
                            />
                        ))}
                    </div>
                    <button
                        className="btn-create"
                        onClick={handleCreate}
                        disabled={!newGroupName.trim() || creating}
                    >
                        {creating ? '创建中...' : '创建'}
                    </button>
                </div>
            )}

            {/* 分组列表 */}
            <nav className="group-list">
                {/* 全部 */}
                <div
                    className={`group-item ${selectedGroupId === null ? 'active' : ''}`}
                    onClick={() => onSelectGroup(null)}
                >
                    <span className="group-icon">📋</span>
                    <span className="group-name">全部</span>
                    <span className="group-count">{totalCount}</span>
                </div>

                {/* 各分组 */}
                {groups.map(group => (
                    <div
                        key={group.id}
                        className={`group-item ${selectedGroupId === group.id ? 'active' : ''}`}
                        onClick={() => onSelectGroup(group.id)}
                    >
                        <span
                            className="group-color"
                            style={{ background: group.color || '#58a6ff' }}
                        />
                        {editingId === group.id ? (
                            <input
                                className="edit-input"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onBlur={() => handleSaveEdit(group.id)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleSaveEdit(group.id)
                                    if (e.key === 'Escape') setEditingId(null)
                                }}
                                onClick={e => e.stopPropagation()}
                                autoFocus
                            />
                        ) : (
                            <span className="group-name">{group.name}</span>
                        )}
                        <span className="group-count">{stockCounts.get(group.id) || 0}</span>
                        
                        {/* 操作按钮（悬浮显示） */}
                        <div className="group-actions">
                            <button
                                className="btn-edit"
                                onClick={(e) => handleStartEdit(group, e)}
                                title="编辑"
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-delete"
                                onClick={(e) => handleDelete(group.id, e)}
                                title="删除"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    )
}

