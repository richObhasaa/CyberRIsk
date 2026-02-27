import { Container, Button } from "./UI";

export default function RoleStep({ setRole, setStep }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">

      <h2 className="text-3xl font-bold mb-12">
        Select User Role
      </h2>

      <div className="flex flex-col md:flex-row gap-8">

        <button
          onClick={() => { setRole("IT"); setStep(2); }}
          className="px-12 py-6 rounded-2xl border border-white/20 
                     hover:border-[#B19EEF] hover:bg-[#B19EEF]/10 
                     transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-2">
            IT / Cybersecurity
          </h3>
          <p className="text-white/60 text-sm max-w-[250px]">
            For administrators, engineers, and technical operators.
          </p>
        </button>

        <button
          onClick={() => { setRole("NON_IT"); setStep(2); }}
          className="px-12 py-6 rounded-2xl border border-white/20 
                     hover:border-[#B19EEF] hover:bg-[#B19EEF]/10 
                     transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-2">
            Non-IT User
          </h3>
          <p className="text-white/60 text-sm max-w-[250px]">
            For business staff and general application users.
          </p>
        </button>

      </div>

    </div>
  );
}