import React from "react";
import "./index.scss";
import Card from "./card";
import { ICommunity, IUser } from "@/utils/types/types";
import CFilter from "../common/Filter";
import EmptyData from "../common/Empty";
import CardListLoader from "./cardListLoader";

interface List {
  value: string;
  title: string;
}
interface IProps {
  cardListData: IUser[] | ICommunity[];
  type: "u" | "c";
  showFilters?: boolean;
  handleFilter?: (filter: List) => void;
  isLoading?: boolean;
}

export default function CardList({
  cardListData,
  type = "u",
  showFilters = false,
  handleFilter,
  isLoading = false,
}: IProps) {
  if (!isLoading && cardListData?.length === 0) {
    return <EmptyData />;
  }
  return (
    //community Filters :['pCount','followers','tSupply','sts','cta', 'uta']

    <main>
      {showFilters && (
        <section className='filters'>
          <CFilter
            list={[
              { value: "followers", title: "Relevance" },
              { value: "pCount", title: "Top" },
              { value: "sts", title: "Trending" },
              { value: "cta", title: "Latest" },
            ]}
            callBack={(filter) => handleFilter?.(filter)}
            defaultListIndex={0}
          />
          <CFilter
            list={[
              { value: "ccount", title: "All time" },
              { value: "time", title: "Past year" },
              { value: "time", title: "Past month" },
              { value: "time", title: "Past week" },
              { value: "time", title: "Today" },
              { value: "time", title: "Past hour" },
            ]}
            callBack={(filter) => handleFilter?.(filter)}
            defaultListIndex={0}
          />
        </section>
      )}
      <section className='communities'>
        {!isLoading ? (
          <>
            {cardListData &&
              cardListData?.map((card) => {
                if (type === "c") {
                  return (
                    <Card
                      key={card?.id}
                      cardData={card as ICommunity}
                      type={type}
                    />
                  );
                } else {
                  return (
                    <Card key={card?.id} cardData={card as IUser} type={type} />
                  );
                }
              })}
          </>
        ) : (
          <div className='communities'>
            {Array(12)
              .fill(() => 0)
              .map((_: any, i: number) => (
                <CardListLoader key={i} />
              ))}
          </div>
        )}
      </section>
    </main>
  );
}
