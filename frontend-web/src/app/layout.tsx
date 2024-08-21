import './globals.css'

export const metadata = {
  title: 'Speedrun',
  description: 'Made by Speedrun',
}

export default function RootLayout({children}: {children: React.ReactNode}): JSX.Element {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}
