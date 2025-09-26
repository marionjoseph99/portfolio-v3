// Wrap everything to avoid leaking globals and brace mismatches
(function () {
	'use strict';
	console.log('script.js loaded: v2');

	// Define once to avoid "already been declared"
	window.projectsData = window.projectsData || {};

	// Custom cursor (smooth, not overly delayed)
	    const cursor = document.querySelector('.cursor');
	    const cursorFollower = document.querySelector('.cursor-follower');

		if (cursor && cursorFollower) {
			// Enable custom cursor only for desktops / wide viewports
			const enableCustomCursor = () => {
				if (window.innerWidth >= 900) document.body.classList.add('use-custom-cursor');
				else document.body.classList.remove('use-custom-cursor');
			};
			enableCustomCursor();
			window.addEventListener('resize', enableCustomCursor);
	        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
	        let dotX = mouseX, dotY = mouseY; // inner dot
	        let ringX = mouseX, ringY = mouseY; // outer ring
	        const dotEase = 0.35;   // dot easing (faster)
	        let ringEase = 0.18;    // ring easing (slightly slower)

			// Lightweight custom cursor (dot + follower) — no trail
			(function initCustomCursor() {
				const cursor = document.querySelector('.cursor');
				const cursorFollower = document.querySelector('.cursor-follower');
				if (!cursor || !cursorFollower) return;

				const setCursorClass = () => {
					if (window.innerWidth >= 900) document.body.classList.add('use-custom-cursor');
					else document.body.classList.remove('use-custom-cursor');
				};
				setCursorClass();
				window.addEventListener('resize', setCursorClass);

				let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
				let dotX = mouseX, dotY = mouseY;
				let ringX = mouseX, ringY = mouseY;

				const dotEase = 0.36;
				const ringEase = 0.14;

				document.addEventListener('mousemove', (e) => {
					mouseX = e.clientX;
					mouseY = e.clientY;
				}, { passive: true });

				function raf() {
					dotX += (mouseX - dotX) * dotEase;
					dotY += (mouseY - dotY) * dotEase;
					ringX += (mouseX - ringX) * ringEase;
					ringY += (mouseY - ringY) * ringEase;
					// Use left/top and keep CSS translate(-50%,-50%) for proper centering
					cursor.style.left = dotX + 'px';
					cursor.style.top = dotY + 'px';
					cursorFollower.style.left = ringX + 'px';
					cursorFollower.style.top = ringY + 'px';
					requestAnimationFrame(raf);
				}
				requestAnimationFrame(raf);

				// Hover effects
				const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .nav-toggle');
				hoverTargets.forEach(el => {
					el.addEventListener('mouseenter', () => { cursor.style.width = '26px'; cursor.style.height = '26px'; cursorFollower.style.opacity = '0'; });
					el.addEventListener('mouseleave', () => { cursor.style.width = '8px'; cursor.style.height = '8px'; cursorFollower.style.opacity = '0.75'; });
				});
			})();
	        // Helper to close navigation
			function closeNavigation() {
				navToggle.classList.remove('active');
				navigation.classList.remove('active');
				document.body.classList.remove('nav-open');
			}

	        // Close navigation with ESC key
	        document.addEventListener('keydown', function(e) {
	            if (e.key === 'Escape' && navigation.classList.contains('active')) {
	                closeNavigation();
	            }
	        });

	        // Close when clicking background overlay
	        const navBg = navigation.querySelector('.nav-bg');
	        if (navBg) {
	            navBg.addEventListener('click', closeNavigation);
	        }

	        // Close on nav link click and smooth-scroll to target section
	        const navLinks = navigation.querySelectorAll('.nav-link');
	        navLinks.forEach(link => {
	            link.addEventListener('click', function(e) {
	                const href = this.getAttribute('href');
	                if (href && href.startsWith('#')) {
	                    e.preventDefault();
	                    const target = document.querySelector(href);
	                    closeNavigation();
	                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	                } else {
	                    closeNavigation();
	                }
	            });
	        });
	    }

	    // Projects filter
	    const filterBtns = document.querySelectorAll('.filter-btn');
	    const projects = document.querySelectorAll('.project-item');

	    if (filterBtns.length && projects.length) {
	        filterBtns.forEach(btn => {
	            btn.addEventListener('click', function() {
	                // Remove active class from all buttons
	                filterBtns.forEach(b => b.classList.remove('active'));
	                
	                // Add active class to clicked button
	                this.classList.add('active');
	                
	                const filter = this.getAttribute('data-filter');
	                
	                // Filter projects by data-category attribute
	                projects.forEach(project => {
						const category = project.getAttribute('data-category');
						project.style.display = (filter === 'all' || category === filter) ? 'block' : 'none';
					});

					// Refresh ScrollTrigger positions after layout changes
					if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
						window.ScrollTrigger.refresh();
					}
		            });
	        });
	    }

		// Auto-size vertical side titles so they fit within the card height
		function sizeProjectSideTitles() {
			const items = document.querySelectorAll('.project-item');
			items.forEach(item => {
				const label = item.querySelector('.project-side-title');
				if (!label) return;
				// Start from a max and shrink until it fits (bounded loops)
				const maxH = item.clientHeight - 28; // respect vertical padding from CSS
				const word = (label.textContent || '').trim();
				if (!word) return;
				// Base size depends on length; shorter words start larger
				const baseByLength = Math.max(26, Math.min(96, Math.floor(420 / Math.max(3, word.length))));
				let fontSize = baseByLength; // px
				label.style.fontSize = fontSize + 'px';
				label.style.lineHeight = '1';
				label.style.maxHeight = maxH + 'px';
				// Because it's vertical-rl rotated, measure clientHeight directly
				let guard = 0;
				while (label.scrollHeight > maxH && fontSize > 16 && guard < 20) {
					fontSize -= 2;
					label.style.fontSize = fontSize + 'px';
					guard++;
				}
			});
		}

		window.addEventListener('load', sizeProjectSideTitles);
		window.addEventListener('resize', () => { sizeProjectSideTitles(); });

		// Auto-fit section headings to prevent wrapping/overflow
		function autoFitHeadings() {
			const headings = document.querySelectorAll('.section-title');
			headings.forEach(h => {
				// Restore base size on each run so we can recompute correctly
				const base = h.getAttribute('data-base-font');
				if (base) {
					h.style.fontSize = base;
				} else {
					// Cache the computed base size once (px)
					const cs = window.getComputedStyle(h);
					const computed = cs.fontSize || '32px';
					h.setAttribute('data-base-font', computed);
				}
				// Ensure single-line measurement context
				h.style.whiteSpace = 'nowrap';
				// Small safety delay if fonts are still loading
				const containerWidth = h.clientWidth;
				const contentWidth = h.scrollWidth;
				if (containerWidth <= 0 || contentWidth <= 0) return;
				if (contentWidth > containerWidth) {
					const currentPx = parseFloat(window.getComputedStyle(h).fontSize);
					if (!currentPx || !isFinite(currentPx)) return;
					const ratio = Math.max(0.6, Math.min(1, (containerWidth - 2) / contentWidth));
					const newPx = Math.max(18, Math.floor(currentPx * ratio * 0.98)); // never below 18px
					h.style.fontSize = newPx + 'px';
				}
			});
		}

		// Run after layout/fonts settle
		window.addEventListener('load', autoFitHeadings);
		window.addEventListener('resize', () => { autoFitHeadings(); });


	    // Scroll animations
	    const animateElements = document.querySelectorAll('.animate');
	    
	    function checkIfInView() {
	        const windowHeight = window.innerHeight;
	        const windowTopPosition = window.scrollY;
	        const windowBottomPosition = windowTopPosition + windowHeight;
	        
	        animateElements.forEach(element => {
	            const elementHeight = element.offsetHeight;
	            const elementTopPosition = element.offsetTop;
	            const elementBottomPosition = elementTopPosition + elementHeight;
	            
	            // Check if element is in viewport
	            if ((elementBottomPosition >= windowTopPosition) && 
	                (elementTopPosition <= windowBottomPosition)) {
	                element.classList.add('animated');
	            }
	        });
	    }
	    
	    // Run on scroll
	    window.addEventListener('scroll', checkIfInView);
	    // Run once on page load
	    window.addEventListener('load', checkIfInView);

	    // Contact form validation
	    const contactForm = document.querySelector('.contact-form');
		// Email-only contact: no extra copy-email UI
	    
		const modal = document.querySelector('.project-modal');
		const prevBtn = document.querySelector('.modal-prev');
		const nextBtn = document.querySelector('.modal-next');
		const projectItems = document.querySelectorAll('.project-item');
		let currentProjectId = null;

		projectItems.forEach((item) => {
			function activate() {
				const projectId = item.getAttribute('data-project');
				const projectData = window.projectsData[projectId];
				if (projectData) {
					currentProjectId = projectId;
					openModal(projectData);
				}
			}
			item.addEventListener('click', (e) => {
				e.preventDefault();
				activate();
			});
			item.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					activate();
				}
			});
		});

	    // Modal: load gallery images into the modal
	    function loadProjectImages(projectData) {
	        const gallery = modal ? modal.querySelector('.modal-gallery') : null;
	        if (!gallery) return;
	        gallery.innerHTML = '';
	        const imgs = Array.isArray(projectData.images) ? projectData.images : [];
	        // Mark single-image vs multi-image for layout rules
	        gallery.classList.toggle('single', imgs.length <= 1);
	        imgs.forEach(src => {
	            const img = document.createElement('img');
	            img.src = src;
	            img.alt = projectData.title || 'Project image';
	            // Click to open zoom overlay
	            img.addEventListener('click', () => openZoom(src, img.alt));
	            gallery.appendChild(img);
	        });
	    }
	;
		// Modal events and navigation
		if (modal) {
			// Close when clicking overlay or the close button
			const overlay = modal.querySelector('.modal-overlay');
			const closeBtn = modal.querySelector('.modal-close');
			overlay && overlay.addEventListener('click', () => closeModal());
			closeBtn && closeBtn.addEventListener('click', () => closeModal());

			// Prev/Next navigation
			function getVisibleProjects() {
				return Array.from(document.querySelectorAll('.project-item')).filter(el => el.offsetParent !== null);
			}

			if (prevBtn) {
				prevBtn.addEventListener('click', () => {
					const visible = getVisibleProjects();
					if (!visible.length || !currentProjectId) return;
					const idx = visible.findIndex(el => el.getAttribute('data-project') === currentProjectId);
					const newIdx = (idx - 1 + visible.length) % visible.length;
					const id = visible[newIdx].getAttribute('data-project');
					const data = window.projectsData[id];
					if (data) { currentProjectId = id; openModal(data); }
				});
			}
			if (nextBtn) {
				nextBtn.addEventListener('click', () => {
					const visible = getVisibleProjects();
					if (!visible.length || !currentProjectId) return;
					const idx = visible.findIndex(el => el.getAttribute('data-project') === currentProjectId);
					const newIdx = (idx + 1) % visible.length;
					const id = visible[newIdx].getAttribute('data-project');
					const data = window.projectsData[id];
					if (data) { currentProjectId = id; openModal(data); }
				});
			}

			// Keyboard navigation when modal is active
			document.addEventListener('keydown', (e) => {
				if (!modal.classList.contains('active')) return;
				if (e.key === 'Escape') closeModal();
				if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
				if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
			});
		}

		// --- Testimonials carousel (infinite, responsive) ---
		(function initTestimonialsCarousel() {
			const carousel = document.querySelector('.testimonials-carousel');
			if (!carousel) return;
			const track = carousel.querySelector('.testimonials-track');
			if (!track) return;
			let items = Array.from(track.children);
			if (items.length === 0) return;

			// Clone items before and after for seamless looping
			const originalCount = items.length;
			const beforeClones = items.map(node => node.cloneNode(true));
			const afterClones = items.map(node => node.cloneNode(true));

			beforeClones.forEach(n => track.insertBefore(n, track.firstChild));
			afterClones.forEach(n => track.appendChild(n));

			// refresh item list to include clones
			items = Array.from(track.children);

			let index = originalCount; // start at the first original
			let autoplayInterval = 4000; // slowed to 4s for better readability
			let timer = null;
			let isAnimating = false;

			function getGap() {
				const gap = getComputedStyle(track).gap;
				return gap ? parseFloat(gap) : 0;
			}

			function slideTo(i, withTransition = true) {
				// Compute offset by measuring distance between the first item and target item
				const firstRect = items[0].getBoundingClientRect();
				const targetRect = items[i].getBoundingClientRect();
				// offset is how far the target's left is from first's left plus any current scroll left of the track
				const containerLeft = track.getBoundingClientRect().left;
				const offset = (targetRect.left - firstRect.left);
				if (withTransition) track.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
				else track.style.transition = 'none';
				track.style.transform = `translateX(-${offset}px)`;
			}

			function next() {
				if (isAnimating) return;
				isAnimating = true;
				index++;
				slideTo(index, true);
			}

			function prev() {
				if (isAnimating) return;
				isAnimating = true;
				index--;
				slideTo(index, true);
			}

			track.addEventListener('transitionend', () => {
				isAnimating = false;
				// Seamless wrap: if we've moved past the cloned region, shift index by +/- originalCount
				if (index >= originalCount * 2) {
					index = index - originalCount;
					slideTo(index, false);
				} else if (index < originalCount) {
					index = index + originalCount;
					slideTo(index, false);
				}
			});

			function start() { stop(); timer = setInterval(next, autoplayInterval); }
			function stop() { if (timer) { clearInterval(timer); timer = null; } }

			carousel.addEventListener('mouseenter', stop);
			carousel.addEventListener('mouseleave', start);
			carousel.addEventListener('focusin', stop);
			carousel.addEventListener('focusout', start);

			carousel.addEventListener('keydown', (e) => {
				if (e.key === 'ArrowRight') next();
				if (e.key === 'ArrowLeft') prev();
			});

			// Recalculate sizes on resize and snap to current index
			let resizeTimeout = null;
			window.addEventListener('resize', () => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(() => { slideTo(index, false); }, 120);
			});

			// initial placement (no transition)
			// Use requestAnimationFrame to ensure layout & fonts are settled so measurements align perfectly
			requestAnimationFrame(() => { slideTo(index, false); start(); });

			// Pointer drag / swipe support (more robust)
			let pointerDown = false;
			let startX = 0;
			let startOffset = 0;
			const dragThreshold = 40; // px

			function getCurrentTranslate() {
				const cs = window.getComputedStyle(track);
				const transform = cs.transform || cs.webkitTransform;
				if (!transform || transform === 'none') return 0;
				const match = transform.match(/matrix\(([^,]+),[^,]+,[^,]+,[^,]+,([^,]+),/);
				if (match) return parseFloat(match[2]);
				// fallback for matrix3d
				const m3 = transform.match(/matrix3d\(.*,([-0-9.]+)\)$/);
				if (m3) return parseFloat(m3[1]);
				return 0;
			}

			track.addEventListener('pointerdown', (e) => {
				pointerDown = true;
				// stop any running animation and allow immediate dragging
				stop();
				isAnimating = false;
				startX = e.clientX;
				startOffset = getCurrentTranslate();
				track.style.transition = 'none';
				track.setPointerCapture && track.setPointerCapture(e.pointerId);
			});

			let lastPointerX = null;
			track.addEventListener('pointermove', (e) => {
				if (!pointerDown) return;
				lastPointerX = e.clientX;
				const dx = e.clientX - startX;
				// apply drag delta to the starting offset (note: translate values are negative when moved left)
				const newTranslate = startOffset + dx;
				track.style.transform = `translateX(${newTranslate}px)`;
			});

			function endDrag(e) {
				if (!pointerDown) return;
				pointerDown = false;
				// Some pointerup events on certain touch devices may not include clientX — use lastPointerX as fallback
				const clientX = (e && typeof e.clientX === 'number') ? e.clientX : lastPointerX;
				const dx = (typeof clientX === 'number' ? clientX : startX) - startX;
				try { track.releasePointerCapture && track.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
				// If user dragged beyond threshold, go next/prev accordingly
				if (Math.abs(dx) > dragThreshold) {
					if (dx < 0) next(); else prev();
				} else {
					// snap back to current index
					slideTo(index, true);
				}
				// resume autoplay after short delay
				setTimeout(start, 350);
				lastPointerX = null;
			}

			track.addEventListener('pointerup', endDrag);
			track.addEventListener('pointercancel', endDrag);
			track.addEventListener('pointerleave', endDrag);
		})();
	    
	    // Modal functions
	    function openModal(projectData) {
	        // Fix #5: Add checks for all modal elements before setting content
	        const title = modal.querySelector('.modal-title');
	        const year = modal.querySelector('.modal-year');
	        const category = modal.querySelector('.modal-category');
	        const description = modal.querySelector('.modal-description');
	        const location = modal.querySelector('.modal-location');
	        const area = modal.querySelector('.modal-area');
	        
	        // Ensure information is placed before gallery for better reading order
	        const contentWrap = modal.querySelector('.modal-content');
	        if (contentWrap) {
	        	const info = contentWrap.querySelector('.modal-info');
	        	const gallery = contentWrap.querySelector('.modal-gallery');
	        	if (info && gallery && info.nextElementSibling !== gallery) {
	        		contentWrap.insertBefore(info, gallery);
	        	}
	        }
	        
	        if (title) title.textContent = projectData.title;
	        if (year) year.textContent = projectData.year;
	        if (category) category.textContent = projectData.category.toUpperCase();
	        if (description) description.textContent = projectData.description;
	        if (location) location.textContent = projectData.location;
	        if (area) area.textContent = projectData.area;
	        
	        // Load gallery images
	        loadProjectImages(projectData);

	        // Ensure zoom overlay exists
	        ensureZoomOverlay();

	        // Always show details first: reset scroll to top (affects mobile where content scrolls)
	        const contentWrapForScroll = modal.querySelector('.modal-content');
	        if (contentWrapForScroll) contentWrapForScroll.scrollTop = 0;
	        
	        // Show modal
	        modal.classList.add('active');
	        document.body.style.overflow = 'hidden'; // Prevent background scrolling
	    }
	    
	    function closeModal() {
	        modal.classList.remove('active');
	        document.body.style.overflow = ''; // Restore scrolling
		}

		// Simple lightbox within the modal
		function ensureZoomOverlay() {
			if (!modal.querySelector('.modal-image-zoom')) {
				const overlay = document.createElement('div');
				overlay.className = 'modal-image-zoom';
				overlay.innerHTML = '<img alt="Zoomed image" />';
				modal.querySelector('.modal-container')?.appendChild(overlay);
				// Close on overlay click
				overlay.addEventListener('click', () => overlay.classList.remove('active'));
				// Close via ESC while overlay open
				document.addEventListener('keydown', (e) => {
					if (e.key === 'Escape' && overlay.classList.contains('active')) {
						overlay.classList.remove('active');
					}
				});
			}
		}

		function openZoom(src, alt) {
			const overlay = modal.querySelector('.modal-image-zoom');
			if (!overlay) return;
			const img = overlay.querySelector('img');
			if (img) { img.src = src; img.alt = alt || 'Zoomed image'; }
			overlay.classList.add('active');
		}

		// Initial animations
		function initAnimations() {
			// Word-level hero animation if GSAP is available; otherwise leave text static
			if (typeof window.gsap !== 'undefined') {
				// Support both older multi-word structure (.hero-word) and the new single .hero-quote
				const heroWords = Array.from(document.querySelectorAll('.hero-word, .hero-quote'));
				const heroTitle = document.querySelector('.hero-title');
				// add sweep masks and set initial styles
				heroWords.forEach(word => {
					// If this is a hero-quote (single node) we still add a mask for sweep
					if (!word.querySelector || !word.querySelector('.reveal-mask')) {
						const mask = document.createElement('span');
						mask.className = 'reveal-mask';
						word.appendChild(mask);
					}
					if (word.style) word.style.overflow = 'hidden';
				});

				const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
				heroWords.forEach((word, i) => {
					const mask = word.querySelector('.reveal-mask');
					// word entrance: skew/blur in
					tl.fromTo(word,
						{ opacity: 0, y: 40, skewY: 6, filter: 'blur(8px)', letterSpacing: '0.08em' },
						{ opacity: 1, y: 0, skewY: 0, filter: 'blur(0px)', letterSpacing: '0em', duration: 1 },
						i * 0.12
					);
					// accent sweep highlight
					if (mask) {
						tl.fromTo(mask,
							{ xPercent: -110, opacity: 0.35 },
							{ xPercent: 110, opacity: 0, duration: 0.7, ease: 'power2.out' },
							i * 0.12 + 0.15
						);
					}
				});

				// subtle mouse parallax on the whole hero title
				if (heroTitle) {
					const parallax = (e) => {
						const dx = (e.clientX - window.innerWidth / 2) * 0.01;
						const dy = (e.clientY - window.innerHeight / 2) * 0.01;
						gsap.to(heroTitle, { x: dx, y: dy, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
					};
					document.addEventListener('mousemove', parallax);
				}
			}
			
			// Split text animation setup (for other plain .split-text elements)
			const splitTexts = document.querySelectorAll('.split-text');
			// Only split elements that contain plain text (no child elements)
			splitTexts.forEach(el => {
				if (el.children && el.children.length > 0) return; // do not touch structured content like hero title
				const content = (el.textContent || '').trim();
				if (!content) return;
				el.innerHTML = '';
				content.split(/\s+/).forEach(word => {
					const outer = document.createElement('span');
					outer.className = 'split-word';
					const inner = document.createElement('span');
					inner.className = 'split-word-inner';
					inner.textContent = word;
					outer.appendChild(inner);
					el.appendChild(outer);
					el.appendChild(document.createTextNode(' '));
				});
			});

			// After splitting, re-fit any affected headings
			autoFitHeadings();

			// Services: interactive 3D tilt + parallax glow
			const svcCards = document.querySelectorAll('.service-card');
			svcCards.forEach(card => {
				let bounding = null;
				function setFromEvent(e) {
					bounding = card.getBoundingClientRect();
					const px = (e.clientX - bounding.left) / bounding.width;
					const py = (e.clientY - bounding.top) / bounding.height;
					const rx = (py - 0.5) * -10; // tilt up/down
					const ry = (px - 0.5) * 10;  // tilt left/right
					card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
					card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
					card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
					card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
				}
				card.addEventListener('mousemove', setFromEvent);
				card.addEventListener('mouseleave', () => {
					card.style.setProperty('--rx', '0deg');
					card.style.setProperty('--ry', '0deg');
					card.style.setProperty('--mx', '50%');
					card.style.setProperty('--my', '50%');
				});
			});
		}

		// Scroll animations
		function initScrollAnimations() {
			const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
			if (hasGSAP) {
				// Ensure ScrollTrigger is registered
				if (typeof gsap.registerPlugin === 'function') {
					try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
				}
				// Section titles animation (both directions)
				gsap.utils.toArray('h2.section-title.split-text').forEach(title => {
					const words = title.querySelectorAll('.split-word-inner');
					if (!words.length) return;
					gsap.fromTo(words,
						{ y: '100%', opacity: 0 },
						{ y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: 'power3.out',
							scrollTrigger: { trigger: title, start: 'top 80%', toggleActions: 'play reverse play reverse' } }
					);
				});

				// Project items animation (both directions)
				gsap.utils.toArray('.project-item').forEach(project => {
					gsap.fromTo(project,
						{ y: 100, opacity: 0 },
						{ y: 0, opacity: 1, duration: 1, ease: 'power3.out',
							scrollTrigger: { trigger: project, start: 'top 90%', toggleActions: 'play reverse play reverse' } }
					);
				});

				// Awards list animation (both directions)
				gsap.utils.toArray('.awards-item').forEach(award => {
					gsap.fromTo(award,
						{ x: -50, opacity: 0 },
						{ x: 0, opacity: 1, duration: 1, ease: 'power3.out',
							scrollTrigger: { trigger: award, start: 'top 90%', toggleActions: 'play reverse play reverse' } }
					);
				});

				// Timeline animation (both directions)
				gsap.utils.toArray('.timeline-item').forEach(item => {
					gsap.fromTo(item,
						{ x: -50, opacity: 0 },
						{ x: 0, opacity: 1, duration: 1, ease: 'power3.out',
							scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play reverse play reverse' } }
					);
				});

				// Form elements animation (both directions)
				const formElements = document.querySelectorAll('.input-group, .submit-btn');
				gsap.fromTo(formElements,
					{ y: 30, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
						scrollTrigger: { trigger: '.contact-form', start: 'top 80%', toggleActions: 'play reverse play reverse' } }
				);

				// Generic hook for any element with .animate class
				gsap.utils.toArray('.animate').forEach(el => {
					gsap.fromTo(el,
						{ y: 30, opacity: 0 },
						{ y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
							scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
					);
				});

				// Animate elements marked with data-scroll (avoid duplicating ones already handled)
				gsap.utils.toArray('[data-scroll]').forEach(el => {
					if (el.closest('.project-item, .awards-item, .timeline-item, .input-group, .submit-btn')) return;
					gsap.fromTo(el,
						{ y: 30, opacity: 0 },
						{ y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
							scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play reverse play reverse' } }
					);
				});

				// Skills bars animation with enter/leave-back behavior
				gsap.utils.toArray('.skill-progress').forEach(bar => {
					const progress = parseInt(bar.getAttribute('data-progress') || '0', 10);
					ScrollTrigger.create({
						trigger: '.skills-grid', start: 'top 80%',
						onEnter: () => gsap.to(bar, { width: progress + '%', duration: 1.2, ease: 'power3.out' }),
						onEnterBack: () => gsap.to(bar, { width: progress + '%', duration: 0.9, ease: 'power3.out' }),
						onLeaveBack: () => gsap.to(bar, { width: '0%', duration: 0.6, ease: 'power2.inOut' })
					});
				});
			} else {
				document.body.classList.add('no-gsap');
				// Fallback: IntersectionObserver adds 'in-view' class
				const observed = document.querySelectorAll('.animate, [data-scroll], .project-item, .awards-item, .timeline-item, .input-group, .submit-btn, .section-title .split-word-inner');
				const io = new IntersectionObserver((entries) => {
					entries.forEach(entry => {
						if (entry.isIntersecting) entry.target.classList.add('in-view');
						else entry.target.classList.remove('in-view');
					});
				}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
				observed.forEach(el => io.observe(el));
			}
		}

		// Form handling
		const formHandler = document.querySelector('.contact-form');
		
		if (formHandler) {
			formHandler.addEventListener('submit', function(e) {
				e.preventDefault();
				
				// Basic form validation
				let isValid = true;
				const formInputs = formHandler.querySelectorAll('input, textarea, select');
				
				formInputs.forEach(input => {
					if (input.hasAttribute('required') && !input.value.trim()) {
						isValid = false;
						input.classList.add('error');
					} else {
						input.classList.remove('error');
					}
				});
				
				if (isValid) {
					// No backend — encourage email usage
					window.location.href = 'mailto:norioniomarjo@gmail.com?subject=Project%20Inquiry&body=Hi%20Marjo%2C%0D%0A%0D%0A';
				}
			});
		}

		// Initialize all animations: handled by startAllAnimationsOnce()

		// Gallery setup
		(function initGallery(){
			const grid = document.getElementById('galleryGrid');
			if (!grid) return;
			// Known folder structure per user
			const sources = [
				{ id: 'manual', folder: 'gallery/manual', badge: 'MANUAL', pattern: ['m1.jpg','m2.jpg','m3.jpg','m4.jpg','m5.jpg','w1.jpg','w2.jpg','w3.jpg','w4.jpg'] },
				{ id: 'interior', folder: 'gallery/interior', badge: 'INTERIOR', pattern: ['i1.jpg','i2.jpg','i3.jpg','i4.jpg','in1.jpg','in2.jpg','in3.jpg','in4.jpg','in5.jpg','in6.jpg','in7.jpg','in8.jpg','in9.jpg','in10.jpg'] },
				{ id: 'exterior', folder: 'gallery/exterior', badge: 'EXTERIOR', pattern: ['e1.jpg','e2.jpg','e3.jpg','e4.jpg'] }
			];

			const items = [];
			sources.forEach(src => {
				src.pattern.forEach((file, idx) => {
					const path = `${src.folder}/${file}`;
					const item = document.createElement('div');
					const sizeClass = (idx % 7 === 0) ? ' large' : ((idx % 5 === 0) ? ' medium' : '');
					item.className = 'gallery-item' + sizeClass;
					item.setAttribute('data-kind', src.id);
					item.setAttribute('data-scroll', '');
					item.innerHTML = `<span class="badge">${src.badge}</span><img src="${path}" alt="${src.id} image" onerror="this.onerror=null; this.style.display='none';">`;
					items.push(item);
				});
			});

			// Append once
			const frag = document.createDocumentFragment();
			items.forEach(el => frag.appendChild(el));
			grid.appendChild(frag);

			// Visibility controls
			const btns = document.querySelectorAll('.gallery-filter-btn');
			const seeMoreBtn = document.getElementById('gallerySeeMore');
			const INITIAL_LIMIT = 9; // show 9 tiles by default
			let expanded = false;

			function applyFilterAndLimit(filter) {
				let shown = 0;
				Array.from(grid.children).forEach(it => {
					const kind = it.getAttribute('data-kind');
					const passes = (filter === 'all' || filter === kind);
					if (!passes) { it.style.display = 'none'; return; }
					if (!expanded && shown >= INITIAL_LIMIT) { it.style.display = 'none'; return; }
					it.style.display = 'inline-block';
					shown++;
				});
				if (seeMoreBtn) {
					const totalForFilter = Array.from(grid.children).filter(x => filter === 'all' || x.getAttribute('data-kind') === filter).length;
					seeMoreBtn.style.display = (expanded || shown >= totalForFilter) ? 'none' : 'inline-flex';
					seeMoreBtn.textContent = expanded ? 'See less' : 'See more';
				}
				if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
					window.ScrollTrigger.refresh();
				}
			}

			function currentFilter() {
				const active = Array.from(btns).find(b => b.classList.contains('active'));
				return active ? active.getAttribute('data-gallery-filter') : 'all';
			}

			btns.forEach(btn => btn.addEventListener('click', function(){
				btns.forEach(b => b.classList.remove('active'));
				this.classList.add('active');
				expanded = false; // reset on filter change
				applyFilterAndLimit(currentFilter());
			}));

			if (seeMoreBtn) {
				seeMoreBtn.addEventListener('click', function(){
					if (!expanded) { // expand
						expanded = true;
						Array.from(grid.children).forEach(it => {
							const kind = it.getAttribute('data-kind');
							const passes = (currentFilter() === 'all' || currentFilter() === kind);
							if (passes) it.style.display = 'inline-block';
						});
						this.textContent = 'See less';
					} else { // collapse
						expanded = false;
						applyFilterAndLimit(currentFilter());
					}
					if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
						window.ScrollTrigger.refresh();
					}
				});
			}

			// Initial state: All with limit
			applyFilterAndLimit('all');
		})();
	})();
