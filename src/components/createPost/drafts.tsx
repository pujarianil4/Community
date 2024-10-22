import React, { useEffect, useState } from "react";
import PostLoader from "./postLoader";
import VirtualList from "@/components/common/virtualList";
import { IPost } from "@/utils/types/types";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import useAsync from "@/hooks/useAsync";
import { getPostsByuName } from "@/services/api/postApi";
import MarkdownRenderer from "../common/MarkDownRender";
import Image from "next/image";
import CButton from "../common/Button";
import EmptyData from "../common/Empty";

export default function Drafts() {
  const [page, setPage] = useState(1);
  const [draftPosts, setDraftPosts] = useState<IPost[]>([]);
  console.log("LENGTH", draftPosts?.length);
  const limit = 8;
  const userNameSelector = (state: RootState) => state?.user;
  const [{}, [user]] = useRedux([userNameSelector]);

  const payload = {
    nameId: user?.profile?.username,
    sortby: "time",
    page,
    limit,
    sts: "draft",
  };
  const {
    isLoading: isLoadingUserPost,
    data: userPosts,
    refetch,
  } = useAsync(getPostsByuName, payload);

  useEffect(() => {
    if (userPosts && userPosts?.length > 0) {
      if (page === 1) {
        setDraftPosts(userPosts);
      } else {
        console.log("CHECK_DATA", page);
        setDraftPosts((prevPosts) => [...prevPosts, ...userPosts]);
      }
    } else {
      setDraftPosts([]);
    }
  }, [userPosts]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  return (
    <section className='draft_posts_section'>
      {page < 2 && isLoadingUserPost ? (
        <>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <PostLoader key={i} />
            ))}
        </>
      ) : (
        <>
          <VirtualList
            listData={draftPosts}
            isLoading={isLoadingUserPost}
            page={page}
            setPage={setPage}
            limit={limit}
            renderComponent={(index: number, post: any) => (
              <article
                className='draft_post'
                key={index}
                // onMouseEnter={() => setIsEditingPost(false)}
              >
                <div className='content'>
                  <MarkdownRenderer markdownContent={post?.text} limit={2} />
                </div>
                {post?.media?.[0] && (
                  <Image
                    className='post_img'
                    src={post.media[0]}
                    alt=''
                    width={160}
                    height={128}
                  />
                )}
                <div className='hover_bx'>
                  <CButton
                    // onClick={() => handleEditPost(post)}
                    className='editBtn'
                  >
                    Edit
                  </CButton>

                  <CButton
                    // onClick={() => draftPost(post)}
                    className='hvr_postBtn'
                  >
                    Post
                  </CButton>
                </div>
              </article>
            )}
            customScrollSelector='draft_posts_section'
            footerHeight={80}
          />
          {isLoadingUserPost && page > 1 && <PostLoader />}
          {!isLoadingUserPost && draftPosts?.length === 0 && page === 1 && (
            <EmptyData />
          )}
        </>
      )}
    </section>
  );
}
