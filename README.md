# 🎂 Happy Birthday Ishika (27 Dec)

Natkhat, comic-style birthday website. Koi build/npm install nahi chahiye — sirf HTML + CSS + JS.

## Kya kya hai
- Countdown to 27 Dec (birthday wale din apne aap confetti 🎉)
- Bhaagne wala "Shararati Gift" button 🏃
- Virtual cake — mic se phoonk maaro ya tap karo
- Natkhat Meter, Wish Wall, Happy Birthday music (bina mp3 ke)

## Customize
Sab kuch `config.js` mein hai: naam, tagline, message, wishes, meter.
Photo ke liye `assets/` mein `ishika.jpg` daalo aur `config.js` mein `photo: "assets/ishika.jpg"` likho.

## Termux se Vercel pe deploy
```bash
pkg update && pkg install nodejs git -y
cd ishika-birthday

# local test (optional)
python -m http.server 8000     # browser mein localhost:8000

# Vercel
npm i -g vercel
vercel login
vercel --prod                  # sab questions pe Enter dabao
```
Agar Termux pe `vercel` CLI na chale: GitHub pe push karo, phir vercel.com → Add New → Project → repo import → Deploy.

Note: Wishes har visitor ke apne browser mein save hoti hain. Sabko dikhane wali wishes `config.js` ke `wishes` mein daalo.
