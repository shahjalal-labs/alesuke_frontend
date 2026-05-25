import baseApi from "./baseApi";

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // type of add assets: BANK_ACCOUNT,INVESTMENT_ACCOUNT, BUSINESS_INTEREST, RETIREMENT_ACCOUNT, INSURANCE_PLAN, SAFE_DEPOSIT_BOX, CRYPTO
    addAssets: builder.mutation({
      query: (data) => ({
        url: `/assets`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assets"],
      
    }),

    getAllAssets: builder.query({
      query: () => ({
        url: `/assets`,
        method: "GET",
      }),
      providesTags: ["assets"],
      
    }),

     deleteAssets: builder.mutation({
      query: (id) => ({
        url: `/assets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["assets"],
      
    }),
  }),
});

export const {
    useAddAssetsMutation,
    useGetAllAssetsQuery,
    useDeleteAssetsMutation,
} = assetsApi;