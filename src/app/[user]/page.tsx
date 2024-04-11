"use client";
import { useUserDataCtx } from "@/lib/hooks";

const UserProfile: React.FC = () => {
	const { user } = useUserDataCtx();
	return <div>Profile</div>;
};

export default UserProfile;
