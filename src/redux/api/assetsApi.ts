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

    // caretakers for pets endpoints

    addCaretaker: builder.mutation({
      query: (data) => ({
        url: `/will/pet-caretakers`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assets"],
      
    }),
    getCaretaker: builder.query({
      query: () => ({
        url: `/will/pet-caretakers`,
        method: "GET",
      }),
      providesTags: ["assets"],
      
    }),

    deleteCaretaker: builder.mutation({
      query: (data) => ({
        url: `/will/pet-caretakers`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assets"],
      
    }),

    // asset loan
     addAssetLoan: builder.mutation({
      query: (data) => ({
        url: `/assets/loans`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assets"],
      
    }),
     getAssetLoan: builder.query({
      query: () => ({
        url: `/assets/loans`,
        method: "GET",
       
      }),
      providesTags: ["assets"],
      
    }),

  }),
});

export const {
    useAddAssetsMutation,
    useGetAllAssetsQuery,
    useDeleteAssetsMutation,
    useAddCaretakerMutation,
    useGetCaretakerQuery,
    useDeleteCaretakerMutation,
    useAddAssetLoanMutation,
    useGetAssetLoanQuery,
} = assetsApi;  
