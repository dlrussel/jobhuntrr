import type { V2_MetaFunction } from '@remix-run/node'

export const meta: V2_MetaFunction = () => [{ title: 'jobhuntrr' }]

export default function Index() {
	return (
		<main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
			<div className="relative sm:pb-16 sm:pt-8">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
						<div className="lg:pt-18 relative px-4 pb-8 pt-8 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-20">
							<h1 className="text-center text-mega font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
								jobhuntrr
							</h1>
							<p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
								A simpler way to manage your job search.
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
