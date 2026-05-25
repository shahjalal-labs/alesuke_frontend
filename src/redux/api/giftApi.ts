import baseApi from "./baseApi";

export const giftApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // gift add types: cash, ITEM,COLLECTION PROPERTY,VEHICLE  
    addGift: builder.mutation({
      query: (data) => ({
        url: `/gifts`,
        method: "POST",  
        body: data,
      }),
      invalidatesTags: ["gifts"],
    }),

    getAllGifts: builder.query({
      query: () => ({
        url: `/gifts`,
        method: "GET",
      }),
      providesTags: ["gifts"],
    }),

    getGiftsType: builder.query({
      query: (type) => ({
        url: `/gifts/type/${type}`,
        method: "GET",
      }),
      providesTags: ["gifts"],
    }),

    // type of property, RESIDENTIAL, COMMERCIAL, LAND, OTHER
    addProperty: builder.mutation({
      query: (data) => ({
        url: `/assets/properties`,
        method: "POST",  
        body: data,
      }),
      invalidatesTags: ["gifts"],
    }),
    // get all properties for a user
    getAllProperties: builder.query({
      query: () => ({
        url: `/assets/properties`,
        method: "GET",
      }),
      providesTags: ["gifts"],
      
    }),
    // delete property by id
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/assets/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gifts"],
    }),
  }),
});

export const {
    useAddGiftMutation,
    useGetAllGiftsQuery,
    useGetGiftsTypeQuery,
    useAddPropertyMutation,
    useGetAllPropertiesQuery,
    useDeletePropertyMutation
} = giftApi;