from typing import Optional
from pydantic import BaseModel
from enum import Enum


class Tier(str, Enum):
    f = "F"
    e = "E"
    d = "D"
    c = "C"
    b = "B"
    a = "A"
    s = "S"
    z = "Z"


class RatedItemBase(BaseModel):
    user_id: int
    movie_id: int
    user_rating: Optional[int] = None
    review: Optional[str] = None
    watched: bool
    tier: Optional[Tier] = None
    username: Optional[str] = None
    picture_url: Optional[str] = None


class RatedItemCreate(RatedItemBase):
    pass


class RatedItemUpdate(RatedItemBase):
    pass


class RatedItem(RatedItemBase):
    id: int
