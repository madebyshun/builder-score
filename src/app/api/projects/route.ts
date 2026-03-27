import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PROJECTS_FILE = path.join(process.env.BOT_DATA_DIR || '/Users/congson/.openclaw/workspace/blocky-builder-bot-beta-new/data', 'projects.json')
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const OWNER_ID = process.env.OWNER_ID || '6614397596'

function loadProjects() {
  try { return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8')) } catch { return [] }
}

function saveProjects(data: any[]) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2))
}

// GET /api/projects — list approved projects
export async function GET() {
  const projects = loadProjects().filter((p: any) => p.approved)
  return NextResponse.json(projects)
}

// POST /api/projects — submit new project from web
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, url, twitter, submitterHandle } = body

  if (!name || !description || !url) {
    return NextResponse.json({ error: 'name, description, url required' }, { status: 400 })
  }

  const projects = loadProjects()
  const newProject = {
    id: `proj_${Date.now()}`,
    name,
    description,
    url,
    twitter: twitter?.replace('@', '') || '',
    submitterId: 0, // web submission
    submitterUsername: submitterHandle?.replace('@', '') || 'web',
    timestamp: Date.now(),
    votes: 0,
    voters: [],
    approved: false,
    source: 'web'
  }

  projects.push(newProject)
  saveProjects(projects)

  // Notify admin via Telegram
  if (BOT_TOKEN) {
    const msg = `📝 <b>New Project — Web Submission</b>\n\n<b>${name}</b>\n${description}\n\n🔗 ${url}\n${twitter ? `🐦 @${twitter.replace('@', '')}\n` : ''}👤 ${submitterHandle || 'Anonymous'}`
    const keyboard = JSON.stringify({ inline_keyboard: [[
      { text: '✅ Approve', callback_data: `admin_approve_${newProject.id}` },
      { text: '❌ Reject', callback_data: `admin_reject_${newProject.id}` }
    ]]})

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: OWNER_ID, text: msg, parse_mode: 'HTML', reply_markup: keyboard, disable_web_page_preview: true })
    }).catch(console.error)
  }

  return NextResponse.json({ success: true, id: newProject.id })
}
