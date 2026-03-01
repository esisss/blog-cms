import { getAuthorsSchema } from "@/schemas/auth";
import { publicDbProcedure, router } from "../trpc";

export const authorsRouter = router({
  getAuthors: publicDbProcedure.output(getAuthorsSchema).query(() => []),
});
