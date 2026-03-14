document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    if (urlInput) {
        urlInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') analyzeUrl();
        });
    }

    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleDarkIcon && themeToggleLightIcon && themeToggleBtn) {

        if (document.documentElement.classList.contains('dark')) {
            themeToggleLightIcon.classList.remove('hidden'); // Show Sun
        } else {
            themeToggleDarkIcon.classList.remove('hidden'); // Show Moon
        }

        // Listen for the click
        themeToggleBtn.addEventListener('click', function() {
            // Toggle the icons
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');

            // Swap the theme and save preference
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        });
    }
});

// Helper function to get SweetAlert styling based on theme
function getSwalConfig() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        confirmButtonColor: '#2563EB' // Brand Blue
    };
}

async function analyzeUrl() {
    const urlInput = document.getElementById('urlInput');
    const btn = document.getElementById('analyzeBtn');
    const loader = document.getElementById('loader');
    const resultsArea = document.getElementById('resultsArea');
    const swalStyle = getSwalConfig();

    const url = urlInput.value.trim();
    if (!url) {
        Swal.fire({
            ...swalStyle,
            icon: 'warning',
            title: 'Empty URL',
            text: 'Please enter a target website URL to analyze.'
        });
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Scanning...`;
    resultsArea.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'An error occurred during analysis.');
        }

        if (data.waf_suspected === true) {
            await Swal.fire({
                ...swalStyle,
                icon: 'error',
                title: 'Firewall Detected',
                html: `
                    <div class="px-2">
                        <p class="text-slate-500 dark:text-slate-400 text-sm mb-4">
                            The scanner was blocked by the target's Web Application Firewall (WAF). Headers are hidden.
                        </p>
                        <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 mb-2">
                            <div class="text-center w-1/2 border-r border-slate-200 dark:border-slate-700">
                                <span class="block text-xs text-slate-400 uppercase font-bold">Status</span>
                                <span class="block ${data.status_code === 200 ? 'text-green-600' : 'text-red-500'} font-bold">
                                    HTTP ${data.status_code}
                                </span>
                            </div>
                            <div class="text-center w-1/2">
                                <span class="block text-xs text-slate-400 uppercase font-bold">Score</span>
                                <span class="block text-red-500 font-bold">0</span>
                            </div>
                        </div>
                    </div>`,
                confirmButtonText: 'Close',
                confirmButtonColor: '#ef4444'
            });
        } else {
            const Toast = Swal.mixin({
                toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
                background: swalStyle.background, color: swalStyle.color
            });
            Toast.fire({ icon: 'success', title: 'Analysis Complete' });
        }

        renderResults(data);

    } catch (error) {
        Swal.fire({
            ...swalStyle,
            icon: 'error',
            title: 'Analysis Failed',
            text: error.message
        });
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>Analyze</span> <i class="fa-solid fa-magnifying-glass"></i>`;
        }
        if (loader) loader.classList.add('hidden');
    }
}

function renderResults(data) {
    const resultsArea = document.getElementById('resultsArea');
    const targetUrlEl = document.getElementById('targetUrl');
    const headersList = document.getElementById('headersList');
    const recList = document.getElementById('recommendationsList');

    if (targetUrlEl) targetUrlEl.innerText = data.target;
    if (headersList) headersList.innerHTML = '';
    if (recList) recList.innerHTML = '';

    if (headersList) {
        data.headers_analyzed.forEach(item => {
            const colorClass = item.present ? 'border-green-500' : 'border-red-400';
            const icon = item.present
                ? '<div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0"><i class="fa-solid fa-check"></i></div>'
                : '<div class="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 flex-shrink-0"><i class="fa-solid fa-xmark"></i></div>';

            const html = `
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border-l-4 shadow-sm flex gap-4 ${colorClass} transition hover:shadow-md">
                    ${icon}
                    <div class="flex-grow min-w-0">
                        <div class="flex justify-between flex-wrap gap-2">
                            <h4 class="font-bold text-slate-800 dark:text-white text-sm md:text-base">${item.label}</h4>
                            <span class="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-300">${item.header}</span>
                        </div>
                        ${item.present
                    ? `<div class="mt-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 p-2 rounded text-slate-600 dark:text-slate-400 break-all border border-slate-100 dark:border-slate-700 overflow-x-auto">${item.value}</div>`
                    : `<p class="text-sm text-red-500 mt-1 flex items-start"><i class="fa-solid fa-triangle-exclamation mr-1.5 mt-0.5 flex-shrink-0"></i> ${item.risk_msg}</p>`
                }
                    </div>
                </div>`;
            headersList.innerHTML += html;
        });
    }

    if (recList) {
        if (data.recommendations.length === 0) {
            recList.innerHTML = `<li class="text-green-600 dark:text-green-400 font-medium flex items-center"><i class="fa-solid fa-check-circle mr-2"></i>This website has an incredibly secure header configuration!</li>`;
        } else {
            data.recommendations.forEach(rec => {
                recList.innerHTML += `<li class="flex items-start pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0"><i class="fa-solid fa-arrow-right text-brand-500 dark:text-brand-400 mt-1 mr-2 text-xs flex-shrink-0"></i><span class="leading-relaxed">${rec}</span></li>`;
            });
        }
    }

    if (resultsArea) {
        resultsArea.classList.remove('hidden');
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    animateScore(data.score);
}

function animateScore(score) {
    const circle = document.getElementById('scoreCircle');
    const valueText = document.getElementById('scoreValue');
    const badge = document.getElementById('gradeBadge');

    if (!circle || !valueText || !badge) return;

    let color = '#ef4444';
    let text = 'HIGH RISK';
    let bg = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

    if (score >= 80) {
        color = '#10b981';
        text = 'SECURE';
        bg = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    } else if (score >= 50) {
        color = '#f59e0b';
        text = 'NEEDS IMPROVEMENT';
        bg = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }

    circle.style.stroke = color;
    badge.className = `px-3 py-1 rounded-lg text-sm font-bold ${bg}`;
    badge.innerText = text;

    let current = 0;
    const stepTime = Math.abs(Math.floor(1000 / (score + 1)));

    const timer = setInterval(() => {
        if (current < score) {
            current++;
            valueText.innerText = current;
        } else {
            valueText.innerText = score;
            clearInterval(timer);
        }
    }, stepTime);

    const offset = 440 - (440 * score / 100);
    setTimeout(() => {
        if (circle) circle.style.strokeDashoffset = offset;
    }, 100);
}