import { Navbar } from "@/components/hero-section-demo-1"
import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center">
      <Navbar/>
      <div className="w-full max-w-sm m-10">
        <SignupForm />
      </div>
    </div>
  )
}
