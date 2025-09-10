import React from "react";

const MainPage: React.FC = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#111714] overflow-x-hidden"
      style={{ fontFamily: '"Spline Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#29382f] px-10 py-4">
          <div className="flex items-center gap-4 text-white">
            <div className="size-6 text-[#38e07b]">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
              Connect
            </h2>
          </div>
          <nav className="hidden md:flex flex-1 justify-center gap-8">
            <a
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              href="#"
            >
              Product
            </a>
            <a className="text-white/80 hover:text-white text-sm font-medium" href="#">
              Solutions
            </a>
            <a className="text-white/80 hover:text-white text-sm font-medium" href="#">
              Resources
            </a>
            <a className="text-white/80 hover:text-white text-sm font-medium" href="#">
              Pricing
            </a>
          </nav>
          <div className="flex gap-2">
            <button className="hidden md:flex min-w-[84px] h-10 items-center justify-center rounded-full px-4 bg-transparent text-white text-sm font-bold hover:bg-[#29382f]">
              Talk to Sales
            </button>
            <button className="flex min-w-[84px] h-10 items-center justify-center rounded-full px-4 bg-[#38e07b] text-[#111714] text-sm font-bold hover:bg-green-400">
              Sign In
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col">
          <section className="w-full py-20 md:py-32 lg:py-40">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl md:text-6xl xl:text-7xl">
                      Connect your team with a modern chat app
                    </h1>
                    <p className="max-w-[600px] text-white/80 md:text-xl">
                      Connect is a secure and efficient communication platform
                      designed for businesses. Streamline your team's
                      communication with one-to-one messaging and channel-based
                      discussions.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#3b82f6] px-8 text-sm font-bold text-white hover:bg-blue-500">
                      Sign Up
                    </button>
                    <button className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-8 text-sm font-bold text-white hover:bg-white/10">
                      Learn More
                    </button>
                  </div>
                </div>
                <img
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI9gGDkLcTqp_ECKv_jIj4IqyHZmU8w-68l15S6hpqQFc3mYPat_Vlk_Y-ko23c_AkvGWHz_11gba_8oFG47PXvwE5I96TuFSRoSLzOIE4cDtjpCBLtuJNJepqI49GwDyyIeJtDlfeeEq2C2gu3R5MJ_SjTkJyMTz0p726omXMLkfb3s1cevT1bVc784IVW8PMYNAledgCWlXpR5oK14LwvzMWNJ7Xov33GBq-3PmVxqlMT2RwEDOumSNtzPA4WsmFlg3KwH5c0bLq"
                />
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter text-white sm:text-5xl">
                    Features
                  </h2>
                  <p className="max-w-[900px] text-white/80 md:text-xl lg:text-base xl:text-xl">
                    Connect offers a range of features to enhance team
                    communication and collaboration.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-8">
                {/* Feature 1 */}
                <div className="grid gap-1 rounded-xl bg-[#1c2620] p-6">
                  <div className="text-[#38e07b]">
                    <svg
                      fill="currentColor"
                      height="32"
                      width="32"
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">One-to-One Chat</h3>
                  <p className="text-sm text-white/80">
                    Direct messaging for individual conversations.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="grid gap-1 rounded-xl bg-[#1c2620] p-6">
                  <div className="text-[#38e07b]">
                    <svg
                      fill="currentColor"
                      height="32"
                      width="32"
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">Group Chat</h3>
                  <p className="text-sm text-white/80">
                    Create groups for team discussions and updates.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="grid gap-1 rounded-xl bg-[#1c2620] p-6">
                  <div className="text-[#38e07b]">
                    <svg
                      fill="currentColor"
                      height="32"
                      width="32"
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M224,88H175.4l8.47-46.57a8,8,0,0,0-15.74-2.86l-9,49.43H111.4l8.47-46.57a8,8,0,0,0-15.74-2.86L95.14,88H48a8,8,0,0,0,0,16H92.23L83.5,152H32a8,8,0,0,0,0,16H80.6l-8.47,46.57a8,8,0,0,0,6.44,9.3A7.79,7.79,0,0,0,80,224a8,8,0,0,0,7.86-6.57l9-49.43H144.6l-8.47,46.57a8,8,0,0,0,6.44,9.3A7.79,7.79,0,0,0,144,224a8,8,0,0,0,7.86-6.57l9-49.43H208a8,8,0,0,0,0-16H163.77l8.73-48H224a8,8,0,0,0,0-16Zm-76.5,64H99.77l8.73-48h47.73Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Channel-Based Communication
                  </h3>
                  <p className="text-sm text-white/80">
                    Organize conversations by topic or project in dedicated
                    channels.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-[#1c2620]">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tighter text-white md:text-4xl">
                  Ready to connect your team?
                </h2>
                <p className="mx-auto max-w-[600px] text-white/80 md:text-xl lg:text-base xl:text-xl">
                  Sign up for Connect today and experience the difference in
                  team communication.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <button className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#38e07b] px-8 text-sm font-bold text-[#111714] hover:bg-green-400">
                  Get Started
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-solid border-t-[#29382f] px-4 py-6 md:px-6">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-white/60">
              © 2024 Connect. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <a className="text-sm text-white/60 hover:text-white/80" href="#">
                Terms of Service
              </a>
              <a className="text-sm text-white/60 hover:text-white/80" href="#">
                Privacy Policy
              </a>
              <a className="text-sm text-white/60 hover:text-white/80" href="#">
                Contact Us
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainPage;
