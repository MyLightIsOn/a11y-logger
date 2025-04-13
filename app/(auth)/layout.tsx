export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div
      id={"main"}
      className="flex flex-col items-center justify-center bg-gray-100 dark:bg-background"
    >
      {children}
    </div>
  );
}
