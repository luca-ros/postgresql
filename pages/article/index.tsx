import type { NextPage } from 'next';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useEffect, useState } from "react";
import { Text, Spacer, User, Button } from "@nextui-org/react";
// localhost:3000/article?id=1

const Article: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    // useState to hold the article data we are going to get,  *define a state:
    const [article, setArticle] = useState<any>({});

    // because we have already access to the router we can get the id out of the router by saying: 
    const { id } = router.query; //this allows us to access the variable ?id=1 in line 7

    useEffect( () => {
        async function getArticle() {
            const {data, error} = await supabaseClient
                .from("articles")
                .select("*")
                .filter("id", "eq", id)
                .single();
            if (error) {
                console.log(error);
            } else {
                setArticle(data);
            }
        }
        if(typeof id !== "undefined") {
            getArticle();
        }
    }, [id])

        // Delete post
    const deleteArticle = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("articles")
                .delete()
                .eq("id", id)
            if (error) throw error;
            router.push("/mainFeed");
        } catch (error: any) {
            alert(error.message);
        }
    }
    
    return (
        <>
            <Text h2>{article.title}</Text>
            <Spacer y={.5} />
            <User
                name={article.user_email?.toLowerCase()}
                size="md"
            />
            <Spacer y={1} />
            <Text size="$lg">
                {article.content}
            </Text>

            {/* if the user and the author of the article ID are the seme the you can delete or update content */}
            { user && article.user_id === user.id ?
                <>
                    <Spacer y={.5} />
                    <Button size="sm" onPress={() => router.push("/editArticle?id=" + id)}> {/* localhost:3000/editArticle */}
                        Edit
                    </Button>
                    <Spacer y={.5} />
                    <Button size="sm" color="error" onPress={() => deleteArticle()}>
                        Delete
                    </Button>
                </>
            : null}
        </>
    )
}

export default Article;