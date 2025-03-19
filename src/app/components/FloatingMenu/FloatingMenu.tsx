"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

// import { signOut } from "@/auth";
import { signOut } from "next-auth/react";

interface MenuItem {
	id: string;
	icon1: string; // First state SVG
	icon2: string; // Second state SVG
	href: string;
	sound?: string;
}

const FloatingMenu = () => {
	const router = useRouter();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [iconStates, setIconStates] = useState<Record<string, boolean>>({});
	const [ripples, setRipples] = useState<
		{ id: string; x: number; y: number }[]
	>([]);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [isMobile, setIsMobile] = useState(false);

	// Initialize audio and check screen size on mount
	useEffect(() => {
		const audioElement = new Audio("/ui-sound/click.mp3");
		audioElement.preload = "auto";
		setAudio(audioElement);

		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const menuItems: MenuItem[] = [
		{
			id: "home",
			icon1: "/svg/menu/home1.svg",
			icon2: "/svg/menu/home2.svg",
			href: "#",
			sound: "/ui-sound/click.mp3",
		},
		{
			id: "hola",
			icon1: "/svg/menu/hola1.svg",
			icon2: "/svg/menu/hola2.svg",
			href: "#",
			sound: "/ui-sound/click.mp3",
		},
		{
			id: "volumen",
			icon1: "/svg/menu/vol1.svg",
			icon2: "/svg/menu/vol2.svg",
			href: "#",
			sound: "/ui-sound/click.mp3",
		},
		{
			id: "info",
			icon1: "/svg/menu/infoPadres1.svg",
			icon2: "/svg/menu/infoPadres2.svg",
			href: "/info",
			sound: "/ui-sound/click.mp3",
		},
		{
			id: "exit",
			icon1: "/svg/menu/puerta1.svg",
			icon2: "/svg/menu/puerta2.svg",
			href: "#",
			sound: "/ui-sound/click.mp3",
		},
	];

	const playSound = async () => {
		try {
			if (audio) {
				audio.currentTime = 0;
				await audio.play();
			}
		} catch (error) {
			console.error("Error playing sound:", error);
		}
	};

	const handleClick = async (item: MenuItem, e: React.MouseEvent) => {
		const button = e.currentTarget as HTMLButtonElement;
		const rect = button.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const rippleId = `${item.id}-${Date.now()}`;
		setRipples((prev) => [...prev, { id: rippleId, x, y }]);

		// Toggle icon state
		setIconStates((prev) => ({
			...prev,
			[item.id]: !prev[item.id],
		}));

		await playSound();
		setActiveId(item.id);

		if (item.id === "exit") {
			await signOut();
			return;
		}

		// Reset icon state after animation
		setTimeout(() => {
			setIconStates((prev) => ({
				...prev,
				[item.id]: false,
			}));
		}, 600);

		await new Promise((resolve) => setTimeout(resolve, 600));
		router.push(item.href);
	};

	const removeRipple = (rippleId: string) => {
		setRipples((prev) => prev.filter((r) => r.id !== rippleId));
	};

	return (
		<motion.div
			className={`
        fixed z-50 bg-white/10 backdrop-blur-sm shadow-lg
        ${
					isMobile
						? "bottom-0 left-0 right-0 p-2 flex justify-around items-center rounded-t-xl"
						: "right-8 top-5 -translate-y-1/2 flex flex-col gap-2 p-2 rounded-full"
				}
      `}
			initial={isMobile ? { y: 100 } : { x: 100, opacity: 0 }}
			animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			{menuItems.map((item) => (
				<motion.div key={item.id} className="relative" initial={false}>
					<motion.button
						className={`
              rounded-full flex items-center justify-center overflow-hidden relative
              ${isMobile ? "w-32 h-32 sm:w-14 sm:h-14" : "w-16 h-16"}
            `}
						onClick={(e) => handleClick(item, e)}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						animate={
							activeId === item.id
								? {
										scale: [1, 1.2, 1],
										rotate: [0, 360],
									}
								: {}
						}
						transition={{
							duration: 0.6,
							times: [0, 0.5, 1],
							ease: "easeInOut",
						}}
					>
						<motion.div
							animate={
								activeId === item.id
									? {
											opacity: [1, 0, 1],
										}
									: {}
							}
							transition={{ duration: 0.3 }}
							className="relative w-24 h-24"
						>
							<Image
								src={iconStates[item.id] ? item.icon2 : item.icon1}
								alt={item.id}
								fill
								className="object-contain"
							/>
						</motion.div>

						<AnimatePresence>
							{ripples.map(
								(ripple) =>
									ripple.id.startsWith(item.id) && (
										<motion.span
											key={ripple.id}
											className="absolute bg-blue-400/30"
											style={{
												width: 10,
												height: 10,
												borderRadius: "50%",
												left: ripple.x - 5,
												top: ripple.y - 5,
											}}
											initial={{ scale: 0, opacity: 0.8 }}
											animate={{ scale: 15, opacity: 0 }}
											transition={{ duration: 0.6, ease: "easeOut" }}
											onAnimationComplete={() => removeRipple(ripple.id)}
										/>
									),
							)}
						</AnimatePresence>
					</motion.button>

					{/* Flash effect */}
					<AnimatePresence>
						{activeId === item.id && (
							<motion.div
								className="absolute inset-0 bg-white rounded-full"
								initial={{ opacity: 0 }}
								animate={{ opacity: [0, 0.5, 0] }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
							/>
						)}
					</AnimatePresence>

					{/* Tooltip - Only show on desktop */}
					{!isMobile && (
						<motion.div
							className="absolute right-full mr-2 bg-gray-800 text-white px-2 py-1 rounded 
                text-sm whitespace-nowrap opacity-0 pointer-events-none"
							initial={{ opacity: 0, x: -10 }}
							animate={{
								opacity: activeId === item.id ? 1 : 0,
								x: activeId === item.id ? 0 : -10,
							}}
							transition={{ duration: 0.2 }}
						>
							{item.id.charAt(0).toUpperCase() + item.id.slice(1)}
						</motion.div>
					)}

					{/* Mobile label */}
					{isMobile && (
						<motion.div
							className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-600"
							animate={{
								opacity: activeId === item.id ? 1 : 0.7,
							}}
						>
							{item.id}
						</motion.div>
					)}
				</motion.div>
			))}
		</motion.div>
	);
};

export default FloatingMenu;
