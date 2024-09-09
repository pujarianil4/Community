import React from "react";
import "./index.scss";
import Card from "./card";
import { ICommunity, IUser } from "@/utils/types/types";
import CFilter from "../common/Filter";

interface List {
  value: string;
  title: string;
}
interface IProps {
  cardListData: IUser[] | ICommunity[];
  type: "u" | "c";
  showFilters?: boolean;
  handleFilter?: (filter: List) => void;
}

export default function CardList({
  cardListData,
  type = "u",
  showFilters = false,
  handleFilter,
}: IProps) {
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
      </section>
    </main>
  );
}
