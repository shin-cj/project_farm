package me.soldesk.springbootback.domain.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
/** ?꾨줎?몄뿏?쒓? 諛깆뿏?쒖뿉 ?붿껌???곗씠?곕? ?대뒗 DTO(?곗씠???꾨떖 媛앹껜)?낅땲?? */
// 紐⑤뱺 ?꾨뱶??getter 硫붿꽌?쒕? Lombok???먮룞 ?앹꽦?⑸땲??
@Getter
// 紐⑤뱺 ?꾨뱶??setter 硫붿꽌?쒕? Lombok???먮룞 ?앹꽦?⑸땲??
@Setter
public class OrderRequest {

    /** ?ъ슜?먯뿉寃??쒖떆?섎뒗 二쇰Ц踰덊샇 */
    private String orderNumber;

    /** 援щℓ???뚯썝 踰덊샇 */
    private Long buyerId;

    /** ?먮ℓ ?띿옣 踰덊샇 */
    private Long farmId;

    /** ?곹뭹 湲덉븸 ?⑷퀎 */
    private Long totalProductPrice;

    /** 諛곗넚鍮?*/
    private Long deliveryFee;

    /** 理쒖쥌 寃곗젣 湲덉븸 */
    private Long finalPrice;

    /** 二쇰Ц 泥섎━ ?곹깭 */
    private String orderStatus;

    /** ?섎졊???대쫫 */
    @NotBlank(message = "수령인 이름을 입력해주세요.")
    @Size(max = 50, message = "수령인 이름은 50자 이하로 입력해주세요.")
    private String receiverName;

    /** ?섎졊???꾪솕踰덊샇 */
    @NotBlank(message = "전화번호를 입력해주세요.")
    @Size(max = 20, message = "전화번호는 20자 이하로 입력해주세요.")
    private String receiverPhone;

    /** 諛곗넚 湲곕낯 二쇱냼 */
    private String receiverAddress;

    /** 諛곗넚 ?곸꽭 二쇱냼 */
    private String receiverDetailAddress;

    /** 諛곗넚 ?붿껌?ы빆 */
    @Size(max = 500, message = "배송 요청사항은 500자 이하로 입력해주세요.")
    private String requestMessage;

    private Long cartItemId;

    private List<Long> cartItemIds;

    private Long productId;

    private Integer quantity;

}
