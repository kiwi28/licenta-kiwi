"use client";
// import { useUserDataCtx } from "@/lib/hooks";
import { ArticleEditor } from "@/modules";
import { usePathname, useRouter } from "next/navigation";

const Admin: React.FC = () => {
	const router = useRouter();
	const pathName = usePathname();

	console.log({ pathName, router });

	return <ArticleEditor />;
};

export default Admin;
