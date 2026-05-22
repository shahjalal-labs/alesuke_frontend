import baseApi from "./baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/profile`,
        method: "PUT",  
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),
    // ------------ add spouse flow/ pet/ child with relation type ----------->>

    addMember: builder.mutation({
      query: (data) => ({
        url: `/profile/people`,
        method: "POST",  
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    getMember: builder.query({
      query: (relationType) => ({
        url: `/profile/people/${relationType}`,
        method: "GET",
      }),
      transformResponse: (response: { data?: unknown[] }) => response?.data ?? [],
      providesTags: ["profile"],
    }),

    // for all spouse/ partner/ child/ pet update and delete 
    updateMember: builder.mutation({
      query: ({ id, data }) => ({
        url: `/profile/people/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/profile/people/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["profile"],
    }),

        // -------update adddress---------->>>

    addAddress: builder.mutation({
      query: (data) => ({
        url: `/profile/address`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    updateAddress: builder.mutation({
      query: ({id, address}) => ({
        url: `/profile/address/${id}`,
        method: "PUT",
        body: address , // Replace with actual address data
      }),
      invalidatesTags: ["profile"],
    }),

     getAllMemberList: builder.query({
      query: () => ({
        url: `/profile/people`,
        method: "GET",
      }),
      transformResponse: (response: { data?: unknown[] }) => response?.data ?? [],
      providesTags: ["profile"],
    }),


   
  }),
});

export const { useUpdateProfileMutation, useAddMemberMutation, useGetMemberQuery,useUpdateMemberMutation,useDeleteMemberMutation,useAddAddressMutation, useUpdateAddressMutation, useGetAllMemberListQuery } = profileApi;