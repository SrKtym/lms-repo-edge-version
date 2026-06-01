import { Description, Label, Radio, RadioGroup } from "@heroui/react";

// 2FA用のラジオグループ
export function RadioGroupFor2fa({
	value,
	onChange,
	isValid,
}: {
	value: string;
	onChange: (value: string) => void;
	isValid: boolean;
}) {
	const style =
		"inline-flex m-0 items-center justify-between flex-row-reverse cursor-pointer rounded-lg gap-4 p-4 border-2 data-[selected=true]:border-accent";

	return (
		<RadioGroup className="gap-4" value={value} onChange={onChange}>
			<Label className="text-center font-bold text-2xl">2要素認証の設定</Label>
			<Description className="flex items-center gap-1 text-lg">
				現在の状態:{" "}
				{isValid ? (
					<p className="text-success">有効</p>
				) : (
					<p className="text-danger">無効</p>
				)}
			</Description>
			<Radio className={style} value="valid">
				<Radio.Control>
					<Radio.Indicator>
						<span />
					</Radio.Indicator>
				</Radio.Control>
				<Radio.Content className="flex flex-col gap-2">
					<Label>TOTPまたはOTPによる認証を有効にする</Label>
					<Description>
						TOTP:
						一定時間ごとに更新されるコードを生成し、ログイン時にそのコードを入力することで認証を行います。
						Google Authenticatorなどのアプリが必要です。
						<br />
						OTP:
						メールアドレスにコードを送信し、ログイン時にそのコードを入力することで認証を行います。
					</Description>
				</Radio.Content>
			</Radio>
			<Radio className={style} value="invalid">
				<Radio.Control>
					<Radio.Indicator>
						<span />
					</Radio.Indicator>
				</Radio.Control>
				<Radio.Content className="flex flex-col gap-2">
					<Label>2要素認証を無効にする</Label>
					<Description>
						メールアドレスとパスワードのみでサインインします。
					</Description>
				</Radio.Content>
			</Radio>
		</RadioGroup>
	);
}
