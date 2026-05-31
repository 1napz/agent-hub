/**
 * Render the Agent Hub home page.
 *
 * Renders a single <main> element containing a heading ("Agent Hub"), a short Thai description,
 * and an ordered list of three setup steps: placing private code into packages/crystalcastle,
 * configuring Supabase, and running `pnpm dev`.
 *
 * @returns A React element containing the main Agent Hub layout with heading, description, and setup steps.
 */
export default function Home(){return(<main style={{padding:48,fontFamily:'system-ui'}}><h1>Agent Hub</h1><p>รวม pure-agent-dev + crystalcastle-ai + claude-code</p><ol><li>วางโค้ด private ลง packages/crystalcastle</li><li>ตั้งค่า Supabase</li><li>pnpm dev</li></ol></main>)}