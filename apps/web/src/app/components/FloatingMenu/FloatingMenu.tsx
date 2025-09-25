"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

// import { signOut } from "@/auth";
import { signOut } from "next-auth/react";
import { initializeAudioForUserInteraction, getDeviceAudioInfo } from "../../utils/gameAudio";

interface MenuItem {
	id: string;
	icon1: string; // First state SVG
	icon2: string; // Second state SVG
	href: string;
	sound?: string;
}

const FloatingMenu = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [iconStates, setIconStates] = useState<Record<string, boolean>>({});
	const [ripples, setRipples] = useState<
		{ id: string; x: number; y: number }[]
	>([]);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [volumeLevel, setVolumeLevel] = useState(0.9); // Default volume 90%
	const [hasVideos, setHasVideos] = useState(false);
	const [deviceAudioInfo, setDeviceAudioInfo] = useState<{
		isIOS: boolean;
		isSafari: boolean;
		hasWebAudio: boolean;
		hasGainNode: boolean;
		audioContextState?: string;
	} | null>(null);
	const [audioInitialized, setAudioInitialized] = useState(false);

	// Load volume from localStorage on mount
	useEffect(() => {
		const savedVolume = localStorage.getItem('video-volume');
		if (savedVolume) {
			setVolumeLevel(parseFloat(savedVolume));
		}
	}, []);

	// Initialize audio and check screen size on mount
	useEffect(() => {
		const audioElement = new Audio("/ui-sound/click.mp3");
		audioElement.preload = "auto";
		setAudio(audioElement);

		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Get device audio info for iOS handling
		const deviceInfo = getDeviceAudioInfo();
		setDeviceAudioInfo(deviceInfo);
		console.log('🎵 Device Audio Info:', deviceInfo);

		checkMobile();
		window.addEventListener("resize", checkMobile);

		// Add a delay to prevent accidental triggering on page load
		const readyTimer = setTimeout(() => {
			setIsReady(true);
			console.log('🔍 FloatingMenu is ready for interactions');
		}, 1000);

		return () => {
			window.removeEventListener("resize", checkMobile);
			clearTimeout(readyTimer);
		};
	}, []);

	// Check for video and audio elements and update state
	useEffect(() => {
		const checkForMediaElements = () => {
			const videos = document.querySelectorAll('video');
			const audios = document.querySelectorAll('audio');

			// Always show volume button - it controls all audio in the app
			setHasVideos(true);
			console.log(`🎬 Found ${videos.length} video elements and ${audios.length} audio elements on page`);
			if (isOnActivityMainPage()) {
				console.log(`🎵 On activity main page - showing volume button for background music`);
			}

			// Apply current volume level to all video elements
			videos.forEach((video: HTMLVideoElement) => {
				if (video.volume !== volumeLevel) {
					video.volume = volumeLevel;
					console.log(`🎵 Applied saved volume ${volumeLevel} to video element`);
				}
			});

			// Apply current volume level to all audio elements (background music, character speech, etc.)
			audios.forEach((audio: HTMLAudioElement) => {
				if (audio.volume !== volumeLevel) {
					audio.volume = volumeLevel;
					console.log(`🎵 Applied saved volume ${volumeLevel} to audio element`);
				}
			});

			// Also dispatch event for programmatically created audio when page loads
			if (isOnActivityMainPage()) {
				window.dispatchEvent(new CustomEvent('globalVolumeChange', {
					detail: { volume: volumeLevel }
				}));
			}
		};

		// Check immediately
		checkForMediaElements();

		// Also check after a delay (for dynamically loaded content)
		const timer = setTimeout(checkForMediaElements, 1000);

		// Set up observer for DOM changes
		const observer = new MutationObserver(checkForMediaElements);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			clearTimeout(timer);
			observer.disconnect();
		};
	}, [pathname, volumeLevel]); // Re-check when page changes or volume changes

	// Helper function to get current activity from pathname
	const getCurrentActivity = () => {
		const match = pathname.match(/\/actividad-(\d+)/);
		return match ? `/actividad-${match[1]}` : null;
	};

	// Check if user is currently in an activity scene (not main activity page)
	const isInActivityScene = () => {
		const activityMatch = pathname.match(/\/actividad-\d+/);
		const sceneMatch = pathname.match(/\/actividad-\d+\/scene/);
		return activityMatch && sceneMatch;
	};

	// Check if user is on an activity main page (has background music)
	const isOnActivityMainPage = () => {
		const activityMainPageMatch = pathname.match(/^\/actividad-\d+$/);
		return activityMainPageMatch;
	};

	// Get volume icon based on current volume level
	const getVolumeIcon = () => {
		if (volumeLevel === 0) {
			return "/svg/menu/vol1.svg"; // Muted (red/gray)
		} else if (volumeLevel <= 0.4) {
			return "/svg/menu/vol1.svg"; // Low volume (yellow/orange)
		} else {
			return "/svg/menu/vol2.svg"; // High volume (green/bright)
		}
	};

	// Get volume icon color filter based on level
	const getVolumeIconStyle = () => {
		if (volumeLevel === 0) {
			return { filter: 'grayscale(100%) brightness(0.5)' }; // Muted - gray
		} else if (volumeLevel <= 0.4) {
			return { filter: 'hue-rotate(45deg) saturate(1.2)' }; // Low - orange/yellow
		} else if (volumeLevel <= 0.6) {
			return { filter: 'hue-rotate(25deg) saturate(1.1)' }; // Medium - light orange
		} else if (volumeLevel <= 0.8) {
			return { filter: 'hue-rotate(0deg) saturate(1.0)' }; // Normal - original color
		} else {
			return { filter: 'hue-rotate(120deg) saturate(1.3) brightness(1.1)' }; // High - green/bright
		}
	};

	const menuItems: MenuItem[] = [
		{
			id: "home",
			icon1: "/svg/menu/home1.svg",
			icon2: "/svg/menu/home2.svg",
			href: "/home",
			sound: "/ui-sound/click.mp3",
		},
		// Map button - only show when in activity scenes
		...(isInActivityScene() ? [{
			id: "map",
			icon1: "/svg/menu/map1.svg",
			icon2: "/svg/menu/map2.svg",
			href: getCurrentActivity() || "/home",
			sound: "/ui-sound/click.mp3",
		}] : []),
		// Volume button - only show when videos are present
		...(hasVideos ? [{
			id: "volumen",
			icon1: getVolumeIcon(),
			icon2: getVolumeIcon(),
			href: "#",
			sound: "/ui-sound/click.mp3",
		}] : []),
		// {
		// 	id: "hola",
		// 	icon1: "/svg/menu/hola1.svg",
		// 	icon2: "/svg/menu/hola2.svg",
		// 	href: "#",
		// 	sound: "/ui-sound/click.mp3",
		// },
		// {
		// 	id: "info",
		// 	icon1: "/svg/menu/infoPadres1.svg",
		// 	icon2: "/svg/menu/infoPadres2.svg",
		// 	href: "/info",
		// 	sound: "/ui-sound/click.mp3",
		// },
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
		console.log('🔍 FloatingMenu handleClick triggered for item:', item.id);
		console.log('🔍 Event details:', e.type, e.target);
		console.log('🔍 FloatingMenu ready state:', isReady);
		
		// Prevent accidental clicks during initial load
		if (!isReady) {
			console.log('🔍 FloatingMenu not ready yet, ignoring click');
			return;
		}
		
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

		// Handle logout
		if (item.id === "exit") {
			console.log('🚪 EXIT button clicked - initiating logout');
			// Reset icon state
			setTimeout(() => {
				setIconStates((prev) => ({
					...prev,
					[item.id]: false,
				}));
			}, 600);

			// Wait for animation to complete
			await new Promise((resolve) => setTimeout(resolve, 600));

			// Sign out without redirect, then manually navigate
			await signOut({ redirect: false });

			// Manually redirect to login page
			router.push('/auth/login');
			return;
		}

		// Handle volume control
		if (item.id === "volumen") {
			console.log('🔊 VOLUME button clicked - adjusting volume');
			console.log('🎵 Device info:', deviceAudioInfo);

			// Initialize audio for user interaction on first click (iPhone requirement only)
			const isIPhone = /iPhone/.test(navigator?.userAgent || '');
			if (!audioInitialized && isIPhone) {
				console.log('📱 Initializing iPhone audio for user interaction');
				await initializeAudioForUserInteraction();
				setAudioInitialized(true);
				// Update device info after initialization
				const updatedDeviceInfo = getDeviceAudioInfo();
				setDeviceAudioInfo(updatedDeviceInfo);
				console.log('📱 Updated device info after iPhone initialization:', updatedDeviceInfo);
			}

			// Cycle through 5 volume levels: 90% -> 70% -> 50% -> 30% -> 0% -> 90%
			let newVolume;
			if (volumeLevel >= 0.85) {
				newVolume = 0.7; // High (90%) to Medium-High (70%)
			} else if (volumeLevel >= 0.65) {
				newVolume = 0.5; // Medium-High (70%) to Medium (50%)
			} else if (volumeLevel >= 0.45) {
				newVolume = 0.3; // Medium (50%) to Low (30%)
			} else if (volumeLevel >= 0.15) {
				newVolume = 0; // Low (30%) to Muted (0%)
			} else {
				newVolume = 0.9; // Muted (0%) to High (90%)
			}

			setVolumeLevel(newVolume);
			console.log(`🎵 Volume changed from ${volumeLevel} to ${newVolume}`);

			// Log volume level description
			const levelDescription = newVolume === 0 ? 'Muted' :
								 newVolume <= 0.3 ? 'Low' :
								 newVolume <= 0.5 ? 'Medium' :
								 newVolume <= 0.7 ? 'Medium-High' : 'High';
			console.log(`🔊 Volume level: ${levelDescription} (${Math.round(newVolume * 100)}%)`);

			// Save volume to localStorage
			localStorage.setItem('video-volume', newVolume.toString());

			// Apply volume to all video and audio elements on the page
			const videos = document.querySelectorAll('video');
			const audios = document.querySelectorAll('audio');

			// Apply volume - same simple approach that works on desktop/Mac/tablets
			console.log('🖥️ Applying volume control');

			videos.forEach((video: HTMLVideoElement) => {
				video.volume = newVolume;
				console.log(`🎬 Applied volume ${newVolume} to video element`);
			});

			audios.forEach((audio: HTMLAudioElement) => {
				audio.volume = newVolume;
				console.log(`🎵 Applied volume ${newVolume} to audio element`);
			});

			// Dispatch custom event for programmatically created audio (background music)
			window.dispatchEvent(new CustomEvent('globalVolumeChange', {
				detail: {
					volume: newVolume,
					isIOS: isIPhone,
					hasWebAudio: deviceAudioInfo?.hasWebAudio || false
				}
			}));
			console.log(`📡 Dispatched global volume change event: ${newVolume} (iPhone: ${isIPhone})`);

			// Reset icon state quickly for volume, no navigation
			setTimeout(() => {
				setIconStates((prev) => ({
					...prev,
					[item.id]: false,
				}));
				setActiveId(null); // Reset active state so button can be clicked again
			}, 300);
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
        fixed z-[9999] bg-white/10 backdrop-blur-sm shadow-lg
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
								? item.id === "volumen"
									? {
											scale: [1, 1.1, 1],
										}
									: {
											scale: [1, 1.2, 1],
											rotate: [0, 360],
										}
								: {}
						}
						transition={{
							duration: item.id === "volumen" ? 0.3 : 0.6,
							times: item.id === "volumen" ? [0, 0.5, 1] : [0, 0.5, 1],
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
								src={item.id === "volumen" ? getVolumeIcon() : (iconStates[item.id] ? item.icon2 : item.icon1)}
								alt={item.id}
								fill
								className="object-contain"
								style={item.id === "volumen" ? getVolumeIconStyle() : {}}
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
							{item.id === "map" ? "Actividad" :
							 item.id === "volumen" ?
								`Volumen ${Math.round(volumeLevel * 100)}%${/iPhone/.test(navigator?.userAgent || '') ? ' (iPhone)' : ''}` :
							 item.id.charAt(0).toUpperCase() + item.id.slice(1)}
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
							{item.id === "map" ? "actividad" :
							 item.id === "volumen" ?
								`vol ${Math.round(volumeLevel * 100)}%${/iPhone/.test(navigator?.userAgent || '') ? ' iPhone' : ''}` :
							 item.id}
						</motion.div>
					)}
				</motion.div>
			))}
		</motion.div>
	);
};

export default FloatingMenu;
