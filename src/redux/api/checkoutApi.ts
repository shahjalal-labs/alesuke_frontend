import baseApi from "./baseApi";

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    checkoutEssentialWill: builder.mutation({
      query: (data) => ({
        url: `/payments/checkout/essential-will`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["checkout"],
      
    }),

    checkoutUnlimitedWill: builder.mutation({
      query: (data) => ({
        url: `/payments/checkout/unlimited-legacy`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["checkout"],
      
    }),

    

    

  }),
});

export const {
    useCheckoutEssentialWillMutation,
    useCheckoutUnlimitedWillMutation,
} = checkoutApi;  
