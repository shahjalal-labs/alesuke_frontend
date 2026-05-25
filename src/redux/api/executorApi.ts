import baseApi from "./baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addExecutor: builder.mutation({
      query: (data) => ({
        url: `/will/executors`,
        method: "POST",  
        body: data,
      }),
      invalidatesTags: ["executors"],
    }),

    addBackupExecutor: builder.mutation({
      query: (data) => ({
        url: `/will/executors/backup`,
        method: "POST",  
        body: data,
      }),
      invalidatesTags: ["executors"],
    }),

    removeExecutor: builder.mutation({
      query: (id) => ({
        url: `/will/executors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["executors"],
    }),
    removeBackupExecutor: builder.mutation({
      query: (id) => ({
        url: `/will/executors/backup/person/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["executors"],
    }),


    getWill: builder.query({
      query: () => ({
        url: `/will`,
        method: "GET",
      }),
      providesTags: ["executors"],
    }),
   
    // -------- distribution endpoints --------

     addDistribution: builder.mutation({
      query: (data) => ({
        url: `/will/distributions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["executors"],
    }),

    getDistributions: builder.query({
      query: () => ({
        url: `/will/distributions`,
        method: "GET",
      }),
      providesTags: ["executors"],
    }),
    
// backup distribution endpoints
 addBackupDistribution: builder.mutation({
      query: ({id, data}) => ({
        url: `/will/distributions/${id}/backup`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["executors"],
    }),

   
  }),
});

export const {
  useAddExecutorMutation,
  useAddBackupExecutorMutation,
  useRemoveExecutorMutation,
  useRemoveBackupExecutorMutation,
  useGetWillQuery,
  useAddDistributionMutation,
  useGetDistributionsQuery,
  useAddBackupDistributionMutation,
} = profileApi;