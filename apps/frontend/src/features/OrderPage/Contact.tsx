import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { SectionContainer } from "./SectionContainer";
interface ContactSupportProps {
  email?: string;
  setEmail: (email: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
}
export function ContactSupport({
  phoneNumber,
  setEmail,
  setPhoneNumber,
  email,
}: ContactSupportProps) {
  return (
    <SectionContainer id={5} title="Detail Kontak">
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-medium text-foreground">
              Email
            </label>
            <div className="flex w-full flex-col items-start">
              <input
                className="relative block h-9 w-full appearance-none rounded-lg border border-border bg-input px-3 text-xs text-foreground 
                placeholder-muted-foreground/50 focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary 
                disabled:cursor-not-allowed disabled:opacity-75"
                type="email"
                placeholder="example@gmail.com"
                name="contact.email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-medium text-foreground">
              No. WhatsApp
            </label>
            <PhoneInput
              international
              defaultCountry="ID"
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value || "")}
              placeholder="628XXXXXXXXXX"
              className="phone-input-custom flex gap-2"
            />
            <span className="text-xs italic text-muted-foreground">
              **Nomor ini akan dihubungi jika terjadi masalah
            </span>
          </div>
          <p className="flex items-center gap-2 rounded-md bg-card px-4 py-2.5 text-xs/6 text-card-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-info h-4 w-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <span>
              Jika ada kendala, kami akan menghubungi nomor WA kamu diatas
            </span>
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
