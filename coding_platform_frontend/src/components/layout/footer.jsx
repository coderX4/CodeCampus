import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="w-full border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} CodeCampus. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link to="/about" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            About
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            Contact
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}

