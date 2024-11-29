import { NavLink } from "react-router-dom"


export default function MenuNavigation() {
	return (
		<header className="container mx-auto px-5 py-10">
			<nav>
				<ul className=" flex justify-center gap-5 md:gap-10">
					<NavLink
						to={"/"}
						className='text-xl md:text-2xl font-semibold border px-4 py-2.5 rounded border-black'
					>
						Search File
					</NavLink>

					<NavLink
						to={"/admin-certificate"}
						className='text-xl md:text-2xl font-semibold border px-4 py-2.5 rounded border-black'
					>
						Upload File
					</NavLink>
                </ul>
			</nav>
		</header>
	)
}