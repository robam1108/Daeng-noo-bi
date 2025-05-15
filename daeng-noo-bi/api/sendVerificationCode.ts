import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, code } = req.body;

  const { EMAIL_FROM, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_FROM || !EMAIL_PASSWORD) {
    return res.status(500).json({ error: "환경변수 누락" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"댕누비 인증" <${EMAIL_FROM}>`,
      to: email,
      subject: "[댕누비] 인증코드 안내",
      text: `요청하신 인증코드는 [ ${code} ] 입니다.\n5분 내로 입력해 주세요.`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("메일 전송 오류 ▶", err);
    res.status(500).json({ error: "메일 전송 실패" });
  }
}
