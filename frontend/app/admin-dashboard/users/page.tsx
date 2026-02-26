"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import ListLayout from "@/app/layouts/ListLayout";

interface User {
    title: string;
    description: string;
    tag: string;
    email: string;
    joinDate: string;
}

function UserProfileModal({ user, onClose, onRoleChange }: {
    user: User;
    onClose: () => void;
    onRoleChange: (newRole: string) => void;
}) {
    const [role, setRole] = useState(user.tag);
    const [saving, setSaving] = useState(false);

    const initials = user.title.split(" ").map(w => w[0]).join("").toUpperCase();

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        onRoleChange(role);
        setSaving(false);
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)" }}
            />

            <div
                className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#B19EEF]/20 border border-[#B19EEF]/40 flex items-center justify-center text-[#B19EEF] text-xl font-bold">
                        {initials}
                    </div>
                    <div>
                        <p className="text-white font-semibold text-lg">{user.title}</p>
                        <p className="text-zinc-400 text-sm">{user.description}</p>
                    </div>
                </div>

                <hr className="border-white/10" />

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Email</span>
                        <span className="text-white text-sm">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Joined</span>
                        <span className="text-white text-sm">{user.joinDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Role</span>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="bg-zinc-800 border border-white/10 text-white text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#B19EEF]"
                        >
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                            <option value="Moderator">Moderator</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || role === user.tag}
                        className="px-4 py-2 text-sm bg-[#B19EEF] text-white rounded-lg disabled:opacity-40 hover:bg-[#9d88e0] transition-colors"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>,
        document.body  // ← renders directly on body, escapes any parent clipping
    );
}

function ActionButton({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const [currentTag, setCurrentTag] = useState(user.tag);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-[#B19EEF] text-white text-sm font-bold px-3 py-2 rounded-lg hover:bg-[#9d88e0] transition-colors"
            >
                View
            </button>

            {open && (
                <UserProfileModal
                    user={{ ...user, tag: currentTag }}
                    onClose={() => setOpen(false)}
                    onRoleChange={setCurrentTag}
                />
            )}
        </>
    );
}

const users: User[] = [
    { title: "User 1", description: "User 1 description", tag: "Admin", email: "user1@example.com", joinDate: "Jan 12, 2024" },
    { title: "User 2", description: "User 2 description", tag: "User", email: "user2@example.com", joinDate: "Feb 3, 2024" },
    { title: "User 3", description: "User 3 description", tag: "User", email: "user3@example.com", joinDate: "Mar 19, 2024" },
    { title: "User 4", description: "User 4 description", tag: "User", email: "user4@example.com", joinDate: "Apr 7, 2024" },
    { title: "User 5", description: "User 5 description", tag: "User", email: "user5@example.com", joinDate: "May 22, 2024" },
];

export default function AdminUsersPage() {
    return (
        <div className="w-full flex flex-col gap-5 pt-10 h-max bg-black border border-transparent text-white font-bold overflow-y-auto">
            <ListLayout
                items={users.map((user) => ({
                    ...user,
                    actionButton: <ActionButton user={user} />,
                }))}
                title="Users"
                subtitle="View all users here"
            />
        </div>
    );
}