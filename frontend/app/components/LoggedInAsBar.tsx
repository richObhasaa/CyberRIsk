export default function LoggedInAsBar({ userEmail }: { userEmail: string }) {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full flex items-center justify-center">
            <p className="text-white text-sm">Logged in as {userEmail}</p>
        </div>
    );
}