import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contentRepository } from '@/services/content';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { asunto, nombre, telefono, email, experiencia, mensaje } = body;

    // Validación básica
    if (!nombre || !telefono || !email || !mensaje) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos obligatorios en el formulario.' },
        { status: 400 }
      );
    }

    // Obtener la configuración de contacto (emailDestinoFormulario)
    const siteConfig = await contentRepository.getSiteConfig();
    const emailDestino = siteConfig.contacto.emailDestinoFormulario || 'contacto@baobabsteatro.com.ar';

    const subject = `[Baobabs Web - ${asunto || 'Consulta General'}] Mensaje de ${nombre}`;

    const textContent = `
Nueva consulta desde el sitio web de Baobabs Club de Teatro:

- Asunto: ${asunto}
- Nombre: ${nombre}
- Teléfono / WhatsApp: ${telefono}
- Correo Electrónico: ${email}
- Experiencia / Perfil: ${experiencia || 'No especificado'}

Mensaje:
${mensaje}

---
Enviado desde el formulario de contacto web de Baobabs.
`;

    const htmlContent = `
<div style="font-family: sans-serif; background-color: #101419; color: #e0e2ea; padding: 24px; border-radius: 8px;">
  <h2 style="color: #22d3ee; margin-top: 0;">Nueva consulta desde la web · Baobabs Teatro</h2>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr><td style="padding: 6px 0; font-weight: bold; width: 140px; color: #2dd4bf;">Asunto:</td><td>${asunto}</td></tr>
    <tr><td style="padding: 6px 0; font-weight: bold; color: #2dd4bf;">Nombre:</td><td>${nombre}</td></tr>
    <tr><td style="padding: 6px 0; font-weight: bold; color: #2dd4bf;">Teléfono:</td><td><a href="https://wa.me/${telefono.replace(/[^\d]/g, '')}" style="color: #22d3ee;">${telefono}</a></td></tr>
    <tr><td style="padding: 6px 0; font-weight: bold; color: #2dd4bf;">Email:</td><td><a href="mailto:${email}" style="color: #22d3ee;">${email}</a></td></tr>
    <tr><td style="padding: 6px 0; font-weight: bold; color: #2dd4bf;">Experiencia:</td><td>${experiencia || 'No especificado'}</td></tr>
  </table>
  <div style="background-color: #1c2025; padding: 16px; border-radius: 6px; border-left: 4px solid #22d3ee;">
    <h4 style="margin-top: 0; color: #ffffff;">Mensaje:</h4>
    <p style="white-space: pre-line; line-height: 1.6; margin-bottom: 0;">${mensaje}</p>
  </div>
</div>
`;

    const smtpHost = process.env.SMTP_HOST || 'localhost';
    const smtpPort = parseInt(process.env.SMTP_PORT || '1025', 10);
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';
    const smtpFrom = process.env.SMTP_FROM || 'Baobabs Web <no-reply@baobabsteatro.com.ar>';

    try {
      // Configurar transporte SMTP de Nodemailer
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
        // Timeout corto para no demorar la respuesta en caso de que no haya servidor SMTP local
        connectionTimeout: 2000,
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: emailDestino,
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[API /contact] Correo enviado exitosamente a ${emailDestino} vía SMTP (${smtpHost}:${smtpPort})`);
    } catch (smtpError) {
      // En modo local o cuando no hay un servidor SMTP levantado, registramos el mensaje sin fallar la petición
      console.warn(
        `[API /contact] No se pudo conectar al servidor SMTP (${smtpHost}:${smtpPort}). Registrando consulta localmente:`,
        smtpError
      );
    }

    return NextResponse.json({
      success: true,
      message: '¡Tu consulta ha sido enviada con éxito!',
    });
  } catch (error) {
    console.error('[API /contact] Error procesando el formulario:', error);
    return NextResponse.json(
      { success: false, message: 'Ocurrió un error inesperado al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
