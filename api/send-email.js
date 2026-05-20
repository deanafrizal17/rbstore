export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { email, code, username } = req.body || {};

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email dan kode verifikasi wajib diisi."
      });
    }

    // Jangan share API key ke publik.
    // Ganti dengan API key Resend kamu yang baru.
    const resendApiKey = "re_G9t7Pggc_CeL1hFhVN3CA6uTphpno3ZBx";

    // Logo harus pakai URL online, bukan image/foto.png
    const logoUrl = "https://rbstore-parel.vercel.app/image/foto.png";

    if (!resendApiKey) {
      return res.status(500).json({
        success: false,
        message: "RESEND_API_KEY belum diisi."
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "RB STORE <onboarding@resend.dev>",
        to: email,
        subject: "Kode Verifikasi RB STORE",
        html: `
          <div style="margin:0;padding:0;background:#070707;font-family:Arial,sans-serif;">
            <div style="max-width:540px;margin:0 auto;padding:34px 18px;">
              <div style="background:#111;border:1px solid rgba(255,255,255,.14);border-radius:30px;padding:30px;color:#fff;box-shadow:0 24px 70px rgba(0,0,0,.45);">

                <div style="text-align:center;margin-bottom:22px;">
                  <img 
                    src="${logoUrl}" 
                    alt="RB STORE Logo" 
                    style="width:86px;height:86px;border-radius:24px;object-fit:cover;border:1px solid rgba(255,255,255,.18);box-shadow:0 14px 35px rgba(0,0,0,.45);display:inline-block;"
                  />
                </div>

                <div style="text-align:center;font-size:13px;color:#aaa;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                  RB STORE Verification
                </div>

                <h1 style="margin:12px 0 8px;font-size:32px;line-height:1.1;text-align:center;">
                  Konfirmasi Email Kamu
                </h1>

                <p style="color:#b8b8b8;line-height:1.7;font-size:15px;text-align:center;margin-top:14px;">
                  Halo <b style="color:#fff;">${username || "User"}</b>, gunakan kode di bawah ini untuk menyelesaikan pendaftaran akun RB STORE.
                </p>

                <div style="margin:26px 0;padding:22px;border-radius:22px;background:#fff;color:#000;text-align:center;font-size:38px;font-weight:900;letter-spacing:8px;">
                  ${code}
                </div>

                <p style="color:#b8b8b8;line-height:1.7;font-size:14px;text-align:center;">
                  Jangan bagikan kode ini ke siapa pun. Jika kamu tidak merasa mendaftar di RB STORE, abaikan email ini.
                </p>

                <div style="margin-top:26px;padding:18px;border-radius:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);">
                  <div style="font-size:14px;font-weight:800;color:#fff;margin-bottom:8px;">
                    Tips Keamanan
                  </div>
                  <div style="color:#b8b8b8;font-size:13px;line-height:1.7;">
                    Pastikan kamu hanya login dan order melalui website official RB STORE. Hati-hati clone atau fake owner.
                  </div>
                </div>

                <div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,.12);color:#777;font-size:12px;text-align:center;">
                  © 2026 RB STORE. Fast Response, Trusted 100%.
                </div>
              </div>
            </div>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengirim email.",
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      message: "Kode verifikasi berhasil dikirim."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message
    });
  }
}