import { getImageSource } from "@/utils/helpers";
import { ICommunity } from "@/utils/types/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CButton from "../common/Button";
import useAsync from "@/hooks/useAsync";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import CommunityFollowButton from "../FollowBtn/communityFollowBtn";
import CHead from "../common/chead";
interface IProps {
  community: ICommunity;
}
export default function Community({ community }: IProps) {
  const [memberCount, setMemberCount] = useState(community.followers);
  const [updatedCommunity, setUpdatedCommunity] =
    useState<ICommunity>(community);
  useEffect(() => {
    setUpdatedCommunity(community);
  }, [community]);

  const handleFollowStatusChange = (isFollowed: boolean) => {
    setMemberCount((prevCount) => (isFollowed ? prevCount + 1 : prevCount - 1));
    setUpdatedCommunity((prev) => ({ ...prev, isFollowed }));
  };

  // const communityId = community?.username;
  // console.log("COMMUNITY____", community);
  // const { isLoading, data, refetch } = useAsync(
  //   fetchCommunityByCname,
  //   communityId
  // );

  // console.log("CHECK1", data);
  // console.log("CHECK2", community);

  // console.log("COMMUNIYT_DATA", data);
  // const userNameSelector = (state: RootState) => state?.user;
  // const refetchRoute = (state: RootState) => state?.common.refetch;
  // const [{ dispatch, actions }, [user, refetchData]] = useRedux([
  //   userNameSelector,
  //   refetchRoute,
  // ]);
  // const [isFollowed, setIsFollowed] = useState<boolean>(data?.isFollowed);
  // console.log("isFollowed", isFollowed);
  // const {
  //   isLoading: isLoadingFollow,
  //   data: followResponse,
  //   callFunction,
  // } = useAsync();

  // const handleFollow = async () => {
  //   try {
  //     if (!isFollowed) {
  //       const data1 = await callFunction(followApi, {
  //         typ: "c",
  //         fwid: data.id,
  //       });

  //       dispatch(actions.setRefetchUser(true));
  //       setIsFollowed(true);
  //     } else {
  //       await UnFollowAPI(data.id);
  //       dispatch(actions.setRefetchUser(true));
  //       setIsFollowed(false);
  //     }
  //   } catch (error) {}
  // };
  // useEffect(() => {
  //   refetch();
  // }, [communityId]);

  // useEffect(() => {
  //   setIsFollowed(data?.isFollowed);

  //   if (refetchData?.user == true) {
  //     refetch();
  //     dispatch(actions.resetRefetch());
  //   }
  // }, [refetchData]);
  // useEffect(() => {
  //   setIsFollowed(data?.isFollowed);
  // }, [data]);
  return (
    <div key={community?.id} className='card_heading'>
      <Link
        href={`c/${community?.username}`}
        as={`/c/${community?.username}`}
        className='community_bx'
      >
        {/* <Image
          src={getImageSource(community?.img?.pro, "c")}
          alt={community?.name}
          width={50}
          height={50}
          loading='lazy'
        />
        <span>{community?.username}</span> */}
        <CHead community={{ ...community, followers: memberCount }} />
      </Link>
      <div className='community_join'>
        {/* <CButton
          loading={isLoadingFollow}
          onClick={handleFollow}
          className='follow_btn'
        >
          {isFollowed ? "Joined" : "Join"}
        </CButton> */}
        <CommunityFollowButton
          communityData={community}
          onSuccess={handleFollowStatusChange}
        />
        {/* <span className='comm_icon'>Join</span> */}
      </div>
    </div>
  );
}
