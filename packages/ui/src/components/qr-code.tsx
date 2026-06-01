import { QRCode } from "react-qr-code";

export function QRCodeComponent({ value }: { value: string }) {
	return <QRCode value={value} />;
}
