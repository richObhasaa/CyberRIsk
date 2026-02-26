import ProtectedRoute from "@/app/components/ProtectedRoute";
import ListLayout from "@/app/layouts/ListLayout";

function ActionButton() {
    return (
        <button className="bg-[#B19EEF] text-white text-sm px-3 py-2 rounded-lg">View</button>
    );
}

export default function AdminUsersPage() {
    return (
        <div className="w-full flex flex-col gap-5 pt-10 h-max bg-black border border-transparent text-white font-bold overflow-y-auto">
            <ListLayout items={[
                { title: "User 1", description: "User 1 description", tag: "Admin", actionButton: <ActionButton /> },
                { title: "User 2", description: "User 2 description", tag: "User", actionButton: <ActionButton /> },
                { title: "User 3", description: "User 3 description", tag: "User", actionButton: <ActionButton /> },
                { title: "User 4", description: "User 4 description", tag: "User", actionButton: <ActionButton /> },
                { title: "User 5", description: "User 5 description", tag: "User", actionButton: <ActionButton /> },
            ]} title="Users" subtitle="View all users here" />
        </div>
    );
}