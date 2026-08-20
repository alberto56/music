These are IDEAS and general unstructured notes and code, not ready for consumption:

//
//
// The formula we are using here is:
// f = (1 / (2 * L)) * sqrt(T / μ) [3]
// Let's take the example of A2 guitar string (second from the top) which has
// * f: a frequency in Hz of 110Hz [1]
// * L: a string length in meters of 0.648 m or 25.5 inches [2]
// * T: a tension in newtons of 101.62 Newtons (see what this means in [4])
// * μ: a mass per unit length in kg/m of 0.005kg/m
//      which is in the range of a typical A4 acoustic guitar string (this
//      means it would take 1/.005 = 200 meters of string to weigh 1kg).
//
// Calculating this:
//
// (1 / (2 * 0.648)) * sqrt(101.62 / 0.005) = 110.0Hz
// (1 / 1.296) * sqrt(20,324) = 110.0Hz
// 0.7716049383 * 142.5622670976 = 110.0Hz
// 110.0Hz = 110.0Hz
//
// The equation was first proposed by French mathematician and music theorist
// Marin Mersenne in his 1636 work Harmonie universelle [5].
//
// [1] 440Hz is a standard for A4, so A2 is 2 octaves below that, which is
//     440 / 2 / 2 = 110Hz
//     See https://en.wikipedia.org/wiki/A440_(pitch_standard).
// [2] Electric Guitar Scale Lengths Explained, Seymour Duncan,
//     Last Updated on July 26th, 2024,
//     https://www.seymourduncan.com/blog/latest-updates/electric-guitar-scale-lengths-explained
// [3] https://www.liutaiomottola.com/formulae/tension.htm
// [4] On Earth, a mass of 1 kilogram experiences a gravitational pull of about
//     9.8 newtons. This means holding a small medium apple (weighing roughly
//     100 grams) in your hand exerts about 1 newton of force. So if our
//     string has a tension of 68 newtons:
//        1 apple = 1 newton
//        68 apples = 68 newtons
//     we can imagine that instead of holding our guitar string taught with
//     a tuning peg, we are tying one end to a weightless bag of 68 apples.
//     It would have the same effect, as long we are on Earth.
// [5] https://en.wikipedia.org/wiki/Mersenne%27s_laws
<div class="my-guitar-string-container">
<div
	class="my-guitar-string-wrapper"
	style={`--length: ${length}px`}
	data-reference-length={length}
	data-reference-freq={hz}
>
	<div class="my-guitar-string"></div>
	<div class="string-end string-end-left"></div>
	<div class="string-end string-end-right"></div>
	<span class="freq-label">{hz}Hz</span>
	<span class="length-label">{hz}Hz</span>
	<span class="tension-label">{hz}Hz</span>
	<span class="freq-label">{hz}Hz</span>
</div>
</div>

<style>
.my-guitar-string-wrapper {
  position: relative;
  display: inline-block;
  width: var(--length);
  height: 2px;
}

.my-guitar-string {
  position: relative;
  width: 100%;
  height: 2px;
  background-color: #5A322A;
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}

/* Larger invisible hit area so the thin string is easier to click */
.my-guitar-string::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -10px;
  bottom: -10px;
}

.my-guitar-string:hover {
  background-color: #8a5142;
  box-shadow: 0 0 4px 1px rgba(90, 50, 42, 0.6);
}

.string-end {
  position: absolute;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #5A322A;
  transform: translate(-50%, -50%);
}

.string-end-left {
  left: 0;
}

.string-end-right {
  left: 100%;
  cursor: ew-resize;
}

/* Larger invisible hit area so the 5px handle is easier to grab */
.string-end-right::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
}

.freq-label {
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
}

/* This class gets added by JavaScript on click */
.vibrate {
  animation: pluck 0.6s ease-out; /* Removed 'infinite' and shortened time */
}

@keyframes pluck {
  0%   { transform: scaleY(1); }
  10%  { transform: scaleY(4); }
  20%  { transform: scaleY(-2.6); }
  30%  { transform: scaleY(1.69); }
  40%  { transform: scaleY(-1.1); }
  50%  { transform: scaleY(1); }
  60%  { transform: scaleY(-1); }
  70%  { transform: scaleY(1); }
  80%  { transform: scaleY(-0.2); }
  90%  { transform: scaleY(1); }
  100% { transform: scaleY(1); }
}
</style>

<script>
function getCurrentFrequency(wrapper: HTMLElement) {
  const referenceLength = parseFloat(wrapper.dataset.referenceLength || '0');
  const referenceFreq = parseFloat(wrapper.dataset.referenceFreq || '440');
  const currentLength = parseFloat(getComputedStyle(wrapper).getPropertyValue('--length'));
  return referenceFreq * (referenceLength / currentLength);
}

function updateFreqLabel(wrapper: HTMLElement) {
  const label = wrapper.querySelector<HTMLElement>('.freq-label');
  if (label) {
    label.textContent = `${Math.round(getCurrentFrequency(wrapper))}Hz`;
  }
}

function pluckString(wrapper: HTMLElement) {
  const stringEl = wrapper.querySelector<HTMLElement>('.my-guitar-string');
  if (!stringEl) return;

  // Remove the class if it's already there (avoids collision)
  stringEl.classList.remove('vibrate');

  // Trigger a reflow to reset the animation state in the browser
  void stringEl.offsetWidth;

  // Add the class to start the vibration
  stringEl.classList.add('vibrate');

  playPluckSound(getCurrentFrequency(wrapper));
}

document.querySelectorAll<HTMLElement>('.my-guitar-string-wrapper').forEach((wrapper) => {
  const stringEl = wrapper.querySelector<HTMLElement>('.my-guitar-string');
  const rightHandle = wrapper.querySelector<HTMLElement>('.string-end-right');
  if (!stringEl || !rightHandle) return;

  stringEl.addEventListener('click', () => pluckString(wrapper));

  const minLength = 20;
  let dragging = false;
  let startX = 0;
  let startLength = 0;

  rightHandle.addEventListener('mousedown', (event) => {
    dragging = true;
    startX = event.clientX;
    startLength = parseFloat(getComputedStyle(wrapper).getPropertyValue('--length'));
    event.preventDefault();
  });

  window.addEventListener('mousemove', (event) => {
    if (!dragging) return;
    const newLength = Math.max(minLength, startLength + (event.clientX - startX));
    wrapper.style.setProperty('--length', `${newLength}px`);
    updateFreqLabel(wrapper);
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
  });
});

function playPluckSound(baseFreq = 440, duration = 1) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const now = ctx.currentTime;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.01); // quick attack, avoids a click
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // fade out
  masterGain.connect(ctx.destination);

  const harmonics = 7; // fundamental + 6 overtones
  for (let n = 1; n <= harmonics; n++) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = baseFreq * n;

    const gain = ctx.createGain();
    gain.gain.value = 1 / n; // each overtone quieter than the last

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }
}
</script>
