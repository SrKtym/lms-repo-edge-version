import { Tabs } from "@heroui/react";

// 提出物用タブ
export function TabsForSubmissions({
	textTab,
	attachmentsTab,
}: {
	textTab: React.ReactNode;
	attachmentsTab: React.ReactNode;
}) {
	return (
		<Tabs variant="secondary">
			<Tabs.ListContainer>
				<Tabs.List aria-label="Options">
					<Tabs.Tab id="text">
						テキスト
						<Tabs.Indicator />
					</Tabs.Tab>
					<Tabs.Tab id="attachments">
						添付ファイル
						<Tabs.Indicator />
					</Tabs.Tab>
				</Tabs.List>
			</Tabs.ListContainer>
			<Tabs.Panel id="text">{textTab}</Tabs.Panel>
			<Tabs.Panel id="attachments">{attachmentsTab}</Tabs.Panel>
		</Tabs>
	);
}

// コース情報用タブ
export function TabsForCourseInfo({
	announcementsTab,
	assignmentsTab,
	membersTab,
}: {
	announcementsTab: React.ReactNode;
	assignmentsTab: React.ReactNode;
	membersTab: React.ReactNode;
}) {
	return (
		<Tabs variant="secondary">
			<Tabs.ListContainer>
				<Tabs.List aria-label="Options">
					<Tabs.Tab id="announcements">
						お知らせ
						<Tabs.Indicator />
					</Tabs.Tab>
					<Tabs.Tab id="assignments">
						課題
						<Tabs.Indicator />
					</Tabs.Tab>
					<Tabs.Tab id="members">
						メンバー
						<Tabs.Indicator />
					</Tabs.Tab>
				</Tabs.List>
			</Tabs.ListContainer>
			<Tabs.Panel id="announcements">{announcementsTab}</Tabs.Panel>
			<Tabs.Panel id="assignments">{assignmentsTab}</Tabs.Panel>
			<Tabs.Panel id="members">{membersTab}</Tabs.Panel>
		</Tabs>
	);
}

export function TabsForProfile({
	profileTab,
	accountSettingsTab,
	notificationSettingsTab,
}: {
	profileTab: React.ReactNode;
	accountSettingsTab: React.ReactNode;
	notificationSettingsTab: React.ReactNode;
}) {
	return (
		<>
			<div className="md:hidden">
				<Tabs variant="secondary">
					<Tabs.ListContainer>
						<Tabs.List aria-label="Options">
							<Tabs.Tab id="profile">
								プロフィール
								<Tabs.Indicator />
							</Tabs.Tab>
							<Tabs.Tab id="account-settings">
								アカウント設定
								<Tabs.Indicator />
							</Tabs.Tab>
							<Tabs.Tab id="notification-settings">
								通知設定
								<Tabs.Indicator />
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
					<Tabs.Panel id="profile">{profileTab}</Tabs.Panel>
					<Tabs.Panel id="account-settings">{accountSettingsTab}</Tabs.Panel>
					<Tabs.Panel id="notification-settings">
						{notificationSettingsTab}
					</Tabs.Panel>
				</Tabs>
			</div>
			<div className="hidden md:block">
				<Tabs variant="secondary" orientation="vertical">
					<Tabs.ListContainer>
						<Tabs.List aria-label="Options" className="gap-6">
							<Tabs.Tab id="profile">
								プロフィール
								<Tabs.Indicator />
							</Tabs.Tab>
							<Tabs.Tab id="account-settings">
								アカウント設定
								<Tabs.Indicator />
							</Tabs.Tab>
							<Tabs.Tab id="notification-settings">
								通知設定
								<Tabs.Indicator />
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
					<Tabs.Panel id="profile">{profileTab}</Tabs.Panel>
					<Tabs.Panel id="account-settings">{accountSettingsTab}</Tabs.Panel>
					<Tabs.Panel id="notification-settings">
						{notificationSettingsTab}
					</Tabs.Panel>
				</Tabs>
			</div>
		</>
	);
}

// 2FA用タブ
export function TabsFor2fa({
	otpForm,
	totpForm,
}: {
	otpForm: React.ReactNode;
	totpForm: React.ReactNode;
}) {
	return (
		<Tabs>
			<Tabs.ListContainer>
				<Tabs.List aria-label="Options">
					<Tabs.Tab id="totp">
						TOTP
						<Tabs.Indicator />
					</Tabs.Tab>
					<Tabs.Tab id="otp">
						OTP
						<Tabs.Indicator />
					</Tabs.Tab>
				</Tabs.List>
			</Tabs.ListContainer>
			<Tabs.Panel id="totp">{totpForm}</Tabs.Panel>
			<Tabs.Panel id="otp">{otpForm}</Tabs.Panel>
		</Tabs>
	);
}
